"""
Institutional Transcript Parser.
Segments earnings calls into Prepared Remarks vs. Unscripted Q&A,
attributes speakers (CEO/CFO/Analyst/Operator), and performs financial sentence tokenization.
"""

import re
from typing import List, Dict, Any, Tuple
from ..schemas import SectionType, SpeakerRole


class TranscriptParser:
    """Parses raw earnings call transcript text into structured speaker turns and sentences."""

    # Common Q&A transition regex patterns
    QA_TRANSITION_PATTERNS = [
        r"question[-\s]and[-\s]answer\s+session",
        r"questions\s+and\s+answers",
        r"q&a\s+session",
        r"open\s+(the\s+call\s+|the\s+lines\s+|the\s+floor\s+)(to|for)\s+questions",
        r"take\s+your\s+first\s+question",
        r"operator\s*:\s*(\[operator\s+instructions\]|ladies\s+and\s+gentlemen,\s+we\s+will\s+now\s+begin)",
    ]

    # Major Wall Street investment firms for analyst detection
    WALL_STREET_FIRMS = {
        "morgan stanley", "goldman sachs", "jpmorgan", "jp morgan", "barclays",
        "bank of america", "bofa", "bernstein", "ubs", "wells fargo", "evercore",
        "jefferies", "citi", "citigroup", "deutsche bank", "mizuho", "oppenheimer",
        "piper sandler", "wolfe research", "td cowen", "stifel", "baird", "truist",
        "keybanc", "rbc capital", "canaccord", "raymond james", "needham", "wedbush"
    }

    def __init__(self):
        self.qa_regex = re.compile("|".join(self.QA_TRANSITION_PATTERNS), re.IGNORECASE)

    def split_sections(self, raw_text: str) -> Tuple[str, str]:
        """
        Splits full transcript into (Prepared Remarks, Q&A Session).
        If no Q&A boundary is detected, treats the entire text as Prepared Remarks.
        """
        match = self.qa_regex.search(raw_text)
        if match:
            split_idx = match.start()
            end_match_idx = match.end()
            prepared = raw_text[:split_idx].strip()
            qa = raw_text[end_match_idx:].strip()
            return prepared, qa
        return raw_text.strip(), ""

    def classify_speaker_role(self, speaker_name: str, affiliation_or_title: str = "") -> SpeakerRole:
        """Determines if the speaker is CEO, CFO, other Executive, Analyst, or Operator."""
        text = f"{speaker_name} {affiliation_or_title}".lower()

        if "operator" in text:
            return SpeakerRole.OPERATOR
        if "ceo" in text or "chief executive" in text:
            return SpeakerRole.CEO
        if "cfo" in text or "chief financial" in text:
            return SpeakerRole.CFO
        if any(w in text for w in ["president", "coo", "chief", "vice president", "treasurer", "director", "head of"]):
            return SpeakerRole.EXECUTIVE
        if any(firm in text for firm in self.WALL_STREET_FIRMS) or "analyst" in text:
            return SpeakerRole.ANALYST

        return SpeakerRole.OTHER

    def tokenize_financial_sentences(self, text: str) -> List[str]:
        """
        Tokenizes text into clean sentences while preserving financial notation:
        Decimals ($1.2B), percentages (15.4%), dates, and abbreviations (Q1, FY25, YoY, BPS, EPS).
        """
        if not text:
            return []

        abbreviations = [
            ("U.S.", "__US__"),
            ("vs.", "__VS__"),
            ("e.g.", "__EG__"),
            ("i.e.", "__IE__"),
            ("Inc.", "__INC__"),
            ("Corp.", "__CORP__"),
            ("Co.", "__CO__"),
            ("Ltd.", "__LTD__"),
            ("approx.", "__APPROX__"),
            ("No.", "__NO__"),
        ]
        
        masked = text
        for abbr, token in abbreviations:
            masked = masked.replace(abbr, token)

        # Protect decimals between digits, e.g., 3.5 -> 3__DOT__5
        masked = re.sub(r'(\d+)\.(\d+)', r'\1__DOT__\2', masked)

        # Protect financial abbreviations like Q1.2 or similar
        masked = re.sub(r'\b(Q[1-4]|FY\d{2,4})\.', r'\1__DOT__', masked)

        # Split on sentence terminals (. ! ?)
        raw_sentences = re.split(r'(?<=[.!?])\s+', masked)

        clean_sentences = []
        for s in raw_sentences:
            s = s.strip()
            if not s:
                continue

            for abbr, token in abbreviations:
                s = s.replace(token, abbr)
            s = s.replace("__DOT__", ".")

            if len(s.split()) >= 3:
                clean_sentences.append(s)

        return clean_sentences

    def parse_transcript(self, raw_text: str) -> List[Dict[str, Any]]:
        """
        Full parse pipeline:
        1. Segments into Prepared Remarks vs. Q&A.
        2. Detects speaker headers (inline or standalone).
        3. Tokenizes each speaker's turn into clean financial sentences.
        """
        prepared_text, qa_text = self.split_sections(raw_text)

        parsed_items: List[Dict[str, Any]] = []
        sentence_counter = 1

        if prepared_text:
            items = self._parse_speaker_blocks(prepared_text, SectionType.PREPARED_REMARKS, sentence_counter)
            parsed_items.extend(items)
            sentence_counter += len(items)

        if qa_text:
            items = self._parse_speaker_blocks(qa_text, SectionType.QA_SESSION, sentence_counter)
            parsed_items.extend(items)

        return parsed_items

    def _parse_speaker_blocks(
        self,
        text: str,
        section: SectionType,
        start_id: int = 1
    ) -> List[Dict[str, Any]]:
        """Iterates line by line tracking active speaker and accumulating sentences."""
        lines = text.split("\n")
        sentences_output: List[Dict[str, Any]] = []
        current_id = start_id

        current_speaker = "Executive"
        current_role = SpeakerRole.EXECUTIVE

        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue

            # Check if line is a section header to skip
            if self.qa_regex.search(line_str) or re.search(r"^(prepared\s+remarks|questions\s+and\s+answers)", line_str, re.IGNORECASE):
                continue

            # Check for speaker prefix: e.g. "Jensen Huang -- CEO: text..."
            colon_idx = line_str.find(":")
            if 0 < colon_idx < 60:
                prefix = line_str[:colon_idx].strip()
                body = line_str[colon_idx + 1:].strip()
                if re.match(r"^[A-Z][a-zA-Z\.\,\'\s\-–—\(\)]+$", prefix):
                    name, role = self._extract_speaker_and_role(prefix)
                    current_speaker = name
                    current_role = role
                    line_str = body

            # If line still has text, tokenize and attach to current speaker
            if line_str:
                for sent in self.tokenize_financial_sentences(line_str):
                    sentences_output.append({
                        "id": current_id,
                        "sentence": sent,
                        "speaker": current_speaker,
                        "speaker_role": current_role,
                        "section": section,
                    })
                    current_id += 1

        return sentences_output

    def _extract_speaker_and_role(self, header: str) -> Tuple[str, SpeakerRole]:
        """Separates speaker name from title or firm."""
        clean_header = header.rstrip(":")
        parts = re.split(r"\s*[-–—]\s*|\s*--\s*", clean_header)
        speaker_name = parts[0].strip()
        affiliation_or_title = " ".join(parts[1:]).strip() if len(parts) > 1 else ""

        # Also check parenthesized titles: e.g. Vivek Arya (Bank of America)
        paren_match = re.search(r"\((.*?)\)", speaker_name)
        if paren_match:
            affiliation_or_title += " " + paren_match.group(1)
            speaker_name = re.sub(r"\(.*?\)", "", speaker_name).strip()

        role = self.classify_speaker_role(speaker_name, affiliation_or_title)
        return speaker_name, role

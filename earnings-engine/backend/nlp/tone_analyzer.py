"""
Financial Tone & Guidance Analyzer.
Extracts forward-looking statement (FLS) scores, executive hedging/uncertainty,
and calculates the Prepared vs. Q&A Tone Divergence Delta.
"""

import re
from typing import List, Dict, Any, Tuple
from collections import defaultdict
from ..schemas import (
    SentenceSentiment,
    SentimentLabel,
    SpeakerRole,
    SectionType,
    ToneMetrics,
    SpeakerSentimentSummary,
)

# Forward-Looking linguistic markers
FORWARD_LOOKING_PATTERNS = [
    r"\b(will|shall)\b",
    r"\b(expect|expects|expected|expecting)\b",
    r"\b(anticipate|anticipates|anticipated)\b",
    r"\b(forecast|forecasts|forecasting)\b",
    r"\b(guidance|outlook|target|targets)\b",
    r"\b(project|projects|projected|projection)\b",
    r"\b(aim|aims|aiming|plan|plans|planning)\b",
    r"\b(looking\s+ahead|next\s+quarter|full\s+year|fiscal\s+year)\b",
]

# Linguistic uncertainty & hedging markers (Loughran-McDonald Uncertainty List)
UNCERTAINTY_PATTERNS = [
    r"\b(cautious|cautiously|caution)\b",
    r"\b(uncertain|uncertainty|uncertainties)\b",
    r"\b(volatility|volatile)\b",
    r"\b(headwind|headwinds)\b",
    r"\b(maybe|perhaps|possibly|potential)\b",
    r"\b(approximate|approximately|roughly)\b",
    r"\b(unclear|unpredictable|contingent|subject\s+to)\b",
    r"\b(depend|depends|depending)\b",
]


class ToneAnalyzer:
    """Analyzes forward guidance, linguistic uncertainty, and speaker divergence."""

    def __init__(self):
        self.fls_regex = re.compile("|".join(FORWARD_LOOKING_PATTERNS), re.IGNORECASE)
        self.uncertainty_regex = re.compile("|".join(UNCERTAINTY_PATTERNS), re.IGNORECASE)

    def is_forward_looking(self, sentence: str) -> bool:
        """Determines if sentence discusses future forecasts or forward guidance."""
        return bool(self.fls_regex.search(sentence))

    def calculate_uncertainty_score(self, sentence: str) -> float:
        """Computes uncertainty score based on hedging word density (0.0 to 1.0)."""
        matches = len(self.uncertainty_regex.findall(sentence))
        if matches == 0:
            return 0.0
        words = len(sentence.split())
        density = matches / max(words, 1)
        return min(1.0, round(density * 5.0, 3))

    def evaluate_sentences(
        self,
        parsed_sentences: List[Dict[str, Any]],
        sentiment_results: List[Dict[str, Any]]
    ) -> List[SentenceSentiment]:
        """Merges parsed token sentences with FinBERT sentiment and tone tags."""
        evaluated: List[SentenceSentiment] = []

        for p_sent, s_res in zip(parsed_sentences, sentiment_results):
            sentence_text = p_sent["sentence"]
            is_fls = self.is_forward_looking(sentence_text)
            unc_score = self.calculate_uncertainty_score(sentence_text)

            evaluated.append(
                SentenceSentiment(
                    id=p_sent["id"],
                    sentence=sentence_text,
                    speaker=p_sent.get("speaker", "Unknown"),
                    speaker_role=p_sent.get("speaker_role", SpeakerRole.OTHER),
                    section=p_sent.get("section", SectionType.PREPARED_REMARKS),
                    label=s_res["label"],
                    score=s_res["score"],
                    positive_prob=s_res["positive_prob"],
                    negative_prob=s_res["negative_prob"],
                    neutral_prob=s_res["neutral_prob"],
                    is_forward_looking=is_fls,
                    uncertainty_score=unc_score,
                )
            )

        return evaluated

    def compute_tone_metrics(
        self,
        sentences: List[SentenceSentiment],
        historical_baseline_sentiment: float = 0.35,
        historical_std: float = 0.12,
    ) -> ToneMetrics:
        """
        Computes aggregate financial metrics:
        - Net Sentiment: (Pos - Neg) / Total
        - Prepared Remarks vs. Q&A Sentiment
        - Divergence Delta: QA_Sentiment - Prepared_Sentiment
        - Forward Guidance Score
        - Trailing 4Q Z-Score Sentiment Shift
        """
        if not sentences:
            return ToneMetrics(
                net_sentiment=0.0,
                prepared_remarks_sentiment=0.0,
                qa_sentiment=0.0,
                divergence_delta=0.0,
                forward_guidance_score=0.0,
                uncertainty_index=0.0,
                z_score_trailing_4q=0.0,
                positive_ratio=0.0,
                negative_ratio=0.0,
                neutral_ratio=1.0,
            )

        total_count = len(sentences)
        pos_count = sum(1 for s in sentences if s.label == SentimentLabel.POSITIVE)
        neg_count = sum(1 for s in sentences if s.label == SentimentLabel.NEGATIVE)
        neu_count = sum(1 for s in sentences if s.label == SentimentLabel.NEUTRAL)

        net_sentiment = round((pos_count - neg_count) / max(total_count, 1), 4)

        # Prepared Remarks
        prep_sents = [s for s in sentences if s.section == SectionType.PREPARED_REMARKS]
        prep_pos = sum(1 for s in prep_sents if s.label == SentimentLabel.POSITIVE)
        prep_neg = sum(1 for s in prep_sents if s.label == SentimentLabel.NEGATIVE)
        prep_net = round((prep_pos - prep_neg) / max(len(prep_sents), 1), 4) if prep_sents else net_sentiment

        # Q&A Session
        qa_sents = [s for s in sentences if s.section == SectionType.QA_SESSION]
        qa_pos = sum(1 for s in qa_sents if s.label == SentimentLabel.POSITIVE)
        qa_neg = sum(1 for s in qa_sents if s.label == SentimentLabel.NEGATIVE)
        qa_net = round((qa_pos - qa_neg) / max(len(qa_sents), 1), 4) if qa_sents else net_sentiment

        # Divergence: Q&A - Prepared
        divergence = round(qa_net - prep_net, 4)

        # Forward Guidance
        fls_sents = [s for s in sentences if s.is_forward_looking]
        fls_pos = sum(1 for s in fls_sents if s.label == SentimentLabel.POSITIVE)
        fls_neg = sum(1 for s in fls_sents if s.label == SentimentLabel.NEGATIVE)
        guidance_score = round((fls_pos - fls_neg) / max(len(fls_sents), 1), 4) if fls_sents else net_sentiment

        # Uncertainty Index (% of sentences with hedging terms)
        hedged_count = sum(1 for s in sentences if s.uncertainty_score > 0)
        uncertainty_index = round(hedged_count / max(total_count, 1), 4)

        # Trailing 4-quarter Z-score anomaly
        z_score = round((net_sentiment - historical_baseline_sentiment) / max(historical_std, 0.001), 2)

        # Speaker level rollups
        speaker_map: Dict[str, Dict[str, Any]] = defaultdict(
            lambda: {"role": SpeakerRole.OTHER, "total": 0, "pos": 0, "neg": 0, "neu": 0, "hedged": 0}
        )
        for s in sentences:
            name = s.speaker
            speaker_map[name]["role"] = s.speaker_role
            speaker_map[name]["total"] += 1
            if s.label == SentimentLabel.POSITIVE:
                speaker_map[name]["pos"] += 1
            elif s.label == SentimentLabel.NEGATIVE:
                speaker_map[name]["neg"] += 1
            else:
                speaker_map[name]["neu"] += 1
            if s.uncertainty_score > 0:
                speaker_map[name]["hedged"] += 1

        speaker_summaries = []
        for name, d in speaker_map.items():
            tot = d["total"]
            net_s = round((d["pos"] - d["neg"]) / max(tot, 1), 3)
            speaker_summaries.append(
                SpeakerSentimentSummary(
                    speaker=name,
                    role=d["role"],
                    sentence_count=tot,
                    net_sentiment=net_s,
                    positive_count=d["pos"],
                    negative_count=d["neg"],
                    neutral_count=d["neu"],
                    uncertainty_ratio=round(d["hedged"] / max(tot, 1), 3),
                )
            )

        speaker_summaries.sort(key=lambda x: x.sentence_count, reverse=True)

        return ToneMetrics(
            net_sentiment=net_sentiment,
            prepared_remarks_sentiment=prep_net,
            qa_sentiment=qa_net,
            divergence_delta=divergence,
            forward_guidance_score=guidance_score,
            uncertainty_index=uncertainty_index,
            z_score_trailing_4q=z_score,
            positive_ratio=round(pos_count / max(total_count, 1), 4),
            negative_ratio=round(neg_count / max(total_count, 1), 4),
            neutral_ratio=round(neu_count / max(total_count, 1), 4),
            speaker_summaries=speaker_summaries,
        )

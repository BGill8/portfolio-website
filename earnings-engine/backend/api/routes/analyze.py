"""
On-demand inference endpoint for custom transcript text or live ticker analysis.
"""

from fastapi import APIRouter, HTTPException
from ...schemas import AnalyzeCustomRequest, AnalyzeCustomResponse
from ...nlp.transcript_parser import TranscriptParser
from ...nlp.finbert_classifier import FinBertClassifier
from ...nlp.tone_analyzer import ToneAnalyzer

router = APIRouter(prefix="/analyze", tags=["Inference"])

# Singleton instances for fast memory reuse
parser = TranscriptParser()
classifier = FinBertClassifier()
analyzer = ToneAnalyzer()


@router.post("/transcript", response_model=AnalyzeCustomResponse)
def analyze_transcript(payload: AnalyzeCustomRequest):
    """
    Parses and scores raw corporate transcript text in real time:
    1. Segments into Prepared Remarks vs unscripted Q&A.
    2. Identifies executive and analyst speakers.
    3. Scores each financial sentence with FinBERT.
    4. Computes tone divergence and forward guidance metrics.
    """
    text = payload.transcript_text
    if not text or not text.strip():
        # Default sample transcript snippet if empty
        text = (
            f"We are extremely pleased with our execution this quarter, delivering record revenue and accelerating margins. "
            f"Looking forward, we anticipate 20% growth despite persistent macroeconomic headwinds in European markets. "
            f"Question-and-Answer Session: "
            f"Analyst: Can you elaborate on the margin compression mentioned in the filing? "
            f"Executive: We see this as purely temporary due to supply chain transitions and expect full recovery."
        )

    # 1. Parse speaker blocks and sentences
    parsed_sentences = parser.parse_transcript(text)
    if not parsed_sentences:
        raise HTTPException(status_code=400, detail="Unable to extract valid financial sentences from input text.")

    # 2. Score with FinBERT
    sentence_texts = [p["sentence"] for p in parsed_sentences]
    sentiment_results = classifier.classify_batch(sentence_texts)

    # 3. Evaluate tone, uncertainty, and forward guidance
    evaluated_sentences = analyzer.evaluate_sentences(parsed_sentences, sentiment_results)

    # 4. Compute aggregate metrics
    tone_metrics = analyzer.compute_tone_metrics(evaluated_sentences)

    return AnalyzeCustomResponse(
        status="success",
        ticker=payload.ticker.upper(),
        sentence_count=len(evaluated_sentences),
        tone_metrics=tone_metrics,
        sentences=evaluated_sentences,
    )

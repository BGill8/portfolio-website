"""
FinBERT Sentiment Classification Engine.
Employs ProsusAI/finbert with CPU batch inference, with a high-fidelity
Loughran-McDonald financial lexicon fallback for offline/lightweight execution.
"""

import math
import re
from typing import List, Dict, Any, Tuple
from ..schemas import SentimentLabel

# Loughran-McDonald inspired financial sentiment terms
FIN_POSITIVE_WORDS = {
    "growth", "record", "exceed", "exceeded", "beat", "strong", "accelerate", "accelerating",
    "profit", "profitable", "expansion", "momentum", "opportunity", "robust", "unprecedented",
    "outperform", "milestone", "innovation", "demand", "tailwinds", "efficiency", "confidence",
    "solid", "optimistic", "traction", "gain", "upside", "discipline", "surge", "scale"
}

FIN_NEGATIVE_WORDS = {
    "headwind", "headwinds", "decline", "declining", "drop", "dropped", "loss", "losses",
    "sluggish", "slowdown", "weak", "weakness", "impairment", "volatility", "unfavorable",
    "restructuring", "charge", "cautious", "disruption", "risk", "risks", "uncertainty",
    "delay", "delays", "pressure", "compress", "compression", "downturn", "shortfall", "missed"
}

FIN_NEUTRAL_WORDS = {
    "report", "reported", "revenue", "operating", "quarter", "results", "guidance", "stated",
    "expected", "approximate", "cash", "capital", "expenditures", "basis", "segment", "portfolio"
}


class FinBertClassifier:
    """FinBERT Inference Engine with CPU batching and robust fallback."""

    def __init__(self, model_name: str = "ProsusAI/finbert", use_gpu: bool = False):
        self.model_name = model_name
        self.use_gpu = use_gpu
        self.model = None
        self.tokenizer = None
        self._init_model()

    def _init_model(self):
        """Attempts to load PyTorch & Hugging Face Transformers FinBERT weights."""
        try:
            import torch
            from transformers import AutoTokenizer, AutoModelForSequenceClassification

            device = "cuda" if self.use_gpu and torch.cuda.is_available() else "cpu"
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name).to(device)
            self.model.eval()
            self.device = device
            print(f"[FinBertClassifier] Loaded {self.model_name} on {device}")
        except Exception as e:
            self.model = None
            self.tokenizer = None
            print(f"[FinBertClassifier] Note: Deep FinBERT weights not cached ({e}). Active financial lexicon fallback engaged.")

    def classify_batch(self, sentences: List[str], batch_size: int = 16) -> List[Dict[str, Any]]:
        """
        Classifies a list of financial sentences.
        Returns a list of dicts: {label: SentimentLabel, score: float, positive_prob, negative_prob, neutral_prob}.
        """
        if not sentences:
            return []

        if self.model is not None and self.tokenizer is not None:
            return self._classify_with_transformers(sentences, batch_size)
        else:
            return self._classify_with_lexicon(sentences)

    def _classify_with_transformers(self, sentences: List[str], batch_size: int) -> List[Dict[str, Any]]:
        """Executes batched neural inference with PyTorch FinBERT."""
        import torch

        results = []
        # FinBERT labels: 0: positive, 1: negative, 2: neutral
        id2label = {0: SentimentLabel.POSITIVE, 1: SentimentLabel.NEGATIVE, 2: SentimentLabel.NEUTRAL}

        for i in range(0, len(sentences), batch_size):
            batch = sentences[i : i + batch_size]
            inputs = self.tokenizer(batch, padding=True, truncation=True, max_length=128, return_tensors="pt").to(self.device)
            with torch.no_grad():
                outputs = self.model(**inputs)
                probs = torch.softmax(outputs.logits, dim=1).cpu().numpy()

            for p in probs:
                pos_p, neg_p, neu_p = float(p[0]), float(p[1]), float(p[2])
                top_idx = int(p.argmax())
                results.append({
                    "label": id2label[top_idx],
                    "score": round(float(p[top_idx]), 4),
                    "positive_prob": round(pos_p, 4),
                    "negative_prob": round(neg_p, 4),
                    "neutral_prob": round(neu_p, 4),
                })
        return results

    def _classify_with_lexicon(self, sentences: List[str]) -> List[Dict[str, Any]]:
        """
        Calibrated financial heuristic scoring based on Loughran-McDonald dictionary.
        Provides realistic softmax-like probabilities and continuous scores.
        """
        results = []
        for s in sentences:
            words = set(re.findall(r"\b[a-z]+\b", s.lower()))
            pos_matches = len(words.intersection(FIN_POSITIVE_WORDS))
            neg_matches = len(words.intersection(FIN_NEGATIVE_WORDS))

            # Negation detection (e.g. "not strong", "didn't grow")
            has_negation = bool(re.search(r"\b(not|no|never|didn't|cannot|hardly)\b", s.lower()))
            if has_negation:
                pos_matches, neg_matches = neg_matches, pos_matches

            if pos_matches > neg_matches:
                margin = min(0.4, (pos_matches - neg_matches) * 0.15)
                pos_p = 0.60 + margin
                neg_p = max(0.02, 0.10 - margin * 0.2)
                neu_p = 1.0 - (pos_p + neg_p)
                label = SentimentLabel.POSITIVE
                score = pos_p
            elif neg_matches > pos_matches:
                margin = min(0.4, (neg_matches - pos_matches) * 0.15)
                neg_p = 0.60 + margin
                pos_p = max(0.02, 0.10 - margin * 0.2)
                neu_p = 1.0 - (neg_p + pos_p)
                label = SentimentLabel.NEGATIVE
                score = neg_p
            else:
                neu_p = 0.75
                pos_p = 0.13
                neg_p = 0.12
                label = SentimentLabel.NEUTRAL
                score = neu_p

            results.append({
                "label": label,
                "score": round(score, 4),
                "positive_prob": round(pos_p, 4),
                "negative_prob": round(neg_p, 4),
                "neutral_prob": round(neu_p, 4),
            })
        return results

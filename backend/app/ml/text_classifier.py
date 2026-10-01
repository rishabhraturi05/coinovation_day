from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Seed training corpus across 6 operational support categories
TRAINING_DATA = [
    # Academic
    ("I am overwhelmed by assignments and upcoming exams", "academic"),
    ("I have three assignments due this week and two exams coming up", "academic"),
    ("I have too much coursework and can't manage my time", "academic"),
    ("I cannot keep up with my classes and lectures", "academic"),
    ("I am falling behind in mathematics and programming labs", "academic"),
    ("Struggling with exam preparation and deadline pressure", "academic"),
    ("My academic advisor is unavailable and I need tutoring", "academic"),
    ("Having severe trouble understanding lecture content and problem sets", "academic"),
    ("Missing classes because I'm overwhelmed by project deadlines", "academic"),

    # Wellbeing
    ("I have been feeling overwhelmed and anxious all the time", "wellbeing"),
    ("I am stressed all the time and can't relax", "wellbeing"),
    ("I feel constant dread, burn out, and mental exhaustion", "wellbeing"),
    ("My anxiety is through the roof this semester", "wellbeing"),
    ("I'm feeling very down, low energy, and emotionally drained", "wellbeing"),
    ("I can't sleep at night because of racing thoughts and stress", "wellbeing"),
    ("Feeling totally burnt out and unable to cope with daily life", "wellbeing"),
    ("I need someone to talk to about my emotional wellbeing", "wellbeing"),

    # Financial
    ("I am worried about paying my tuition fee this semester", "financial"),
    ("I cannot afford hostel fees and living costs", "financial"),
    ("Struggling to buy groceries and textbooks this month", "financial"),
    ("My scholarship payment was delayed and I have no money", "financial"),
    ("Need urgent emergency student loan or bursary assistance", "financial"),
    ("Working two part-time jobs just to pay rent and it's killing me", "financial"),
    ("Financial emergency with registration fees and hall dining dues", "financial"),

    # Social
    ("I feel isolated and haven't made any friends here", "social"),
    ("I am having trouble making friends and feel very lonely", "social"),
    ("Homesick and disconnected from campus life and societies", "social"),
    ("Feeling left out in my dorm and struggle in social situations", "social"),
    ("I miss my family and don't know anyone in my department", "social"),
    ("Having roommate conflicts and feeling uncomfortable in my room", "social"),

    # Accommodation / Housing
    ("Hostel room maintenance issue hasn't been fixed for weeks", "accommodation"),
    ("Landlord is increasing rent and threatening eviction", "accommodation"),
    ("Need help with campus accommodation or dorm transfer", "accommodation"),
    ("No hot water or electricity in student residence", "accommodation"),
    ("Searching for affordable off-campus student housing", "accommodation"),

    # General
    ("Just checking in, doing alright overall", "general"),
    ("Had a busy week but managing well so far", "general"),
    ("Looking forward to the weekend break", "general"),
    ("Nothing major, just wanted to log my thoughts", "general"),
    ("All good this week thanks", "general"),
]

class TextSupportClassifier:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
        self.model = LogisticRegression(C=1.0, max_iter=200)
        self.is_trained = False
        self._train()

    def _train(self):
        texts = [item[0] for item in TRAINING_DATA]
        labels = [item[1] for item in TRAINING_DATA]
        X = self.vectorizer.fit_transform(texts)
        self.model.fit(X, labels)
        self.is_trained = True

    def classify(self, text: str) -> List[Dict[str, Any]]:
        """
        Classifies student free-text note into support topic areas.
        NOT for clinical diagnosis — strictly for connecting to support resources.
        """
        if not text or len(text.strip()) < 4:
            return [{"category": "general", "confidence": 1.0}]

        try:
            X_test = self.vectorizer.transform([text])
            probs = self.model.predict_proba(X_test)[0]
            classes = self.model.classes_

            # Sort categories by probability
            scored = sorted(zip(classes, probs), key=lambda x: x[1], reverse=True)
            
            # Filter categories with meaningful probability
            results = []
            for cat, prob in scored:
                if prob >= 0.15:
                    results.append({
                        "category": cat,
                        "confidence": round(float(prob), 2)
                    })

            if not results or results[0]["confidence"] < 0.25:
                return [{"category": "general", "confidence": 0.50}]

            return results[:2] # Top 1-2 categories
        except Exception:
            return [{"category": "general", "confidence": 0.50}]

# Singleton instance
classifier = TextSupportClassifier()

def classify_student_text(text: str) -> List[Dict[str, Any]]:
    return classifier.classify(text)

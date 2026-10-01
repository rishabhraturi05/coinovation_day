from fastapi import APIRouter
from ..schemas import TextClassifyRequest, TextClassifyResponse
from ..ml.text_classifier import classify_student_text

router = APIRouter(prefix="/api/ml", tags=["Machine Learning"])

@router.post("/classify-text", response_model=TextClassifyResponse)
def classify_text_endpoint(req: TextClassifyRequest):
    """
    Classifies student note text into non-clinical support categories.
    Powered by scikit-learn TfidfVectorizer + LogisticRegression.
    """
    categories = classify_student_text(req.text)
    return {"detected_categories": categories}

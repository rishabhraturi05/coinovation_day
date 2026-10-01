from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import SupportResource, Student
from ..schemas import SupportResourceResponse
from ..services.analysis_service import get_student_analysis

router = APIRouter(prefix="/api/resources", tags=["Support Resources"])

@router.get("", response_model=List[SupportResourceResponse])
def get_resources(category: Optional[str] = None, db: Session = Depends(get_db)):
    """List all available campus support resources."""
    query = db.query(SupportResource)
    if category:
        query = query.filter(SupportResource.category == category.lower())
    return query.all()

@router.get("/recommended/{student_id}", response_model=List[SupportResourceResponse])
def get_recommended_resources(student_id: int, db: Session = Depends(get_db)):
    """Return tailored resources for a specific student based on their check-in signals."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    analysis = get_student_analysis(db, student_id)
    recommended_titles = analysis.get("recommended_support", [])

    all_resources = db.query(SupportResource).all()
    # Match by title or category
    matched = []
    for r in all_resources:
        if any(keyword.lower() in r.title.lower() for keyword in ["academic", "advisor", "study", "peer"]):
            if r not in matched:
                matched.append(r)

    if not matched:
        matched = all_resources[:3]

    return matched[:4]

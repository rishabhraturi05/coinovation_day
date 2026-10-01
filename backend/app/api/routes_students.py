from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Student, CheckIn
from ..schemas import StudentResponse, CheckInResponse

router = APIRouter(prefix="/api/students", tags=["Students"])

@router.get("", response_model=List[StudentResponse])
def get_students(db: Session = Depends(get_db)):
    """Retrieve all students (used in demo selectors)."""
    return db.query(Student).order_by(Student.student_code.asc()).all()

@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):
    """Retrieve student details by integer ID or student code lookup."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.get("/code/{student_code}", response_model=StudentResponse)
def get_student_by_code(student_code: str, db: Session = Depends(get_db)):
    """Retrieve student by their code (e.g. CP1042)."""
    student = db.query(Student).filter(Student.student_code == student_code.upper()).first()
    if not student:
        raise HTTPException(status_code=404, detail=f"Student {student_code} not found")
    return student

@router.get("/{student_id}/checkins", response_model=List[CheckInResponse])
def get_student_checkins(student_id: int, db: Session = Depends(get_db)):
    """Retrieve student check-in history sorted chronologically descending."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return db.query(CheckIn).filter(CheckIn.student_id == student_id).order_by(CheckIn.created_at.desc()).all()

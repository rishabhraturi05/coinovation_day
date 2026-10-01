from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import CheckIn, Student, SupportRequest
from ..schemas import CheckInCreate, CheckInResponse, AnalysisResponse
from ..services.analysis_service import get_student_analysis

router = APIRouter(prefix="/api", tags=["CheckIns & Analysis"])

@router.post("/checkins", response_model=CheckInResponse)
def create_checkin(checkin_in: CheckInCreate, db: Session = Depends(get_db)):
    """
    Submits a new 30-second wellbeing check-in.
    If the student requested support, automatically queues a SupportRequest for staff triage.
    """
    student = db.query(Student).filter(Student.id == checkin_in.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    new_checkin = CheckIn(
        student_id=checkin_in.student_id,
        stress_score=checkin_in.stress_score,
        sleep_score=checkin_in.sleep_score,
        workload_score=checkin_in.workload_score,
        social_connection_score=checkin_in.social_connection_score,
        overwhelmed_score=checkin_in.overwhelmed_score,
        attendance_problem=checkin_in.attendance_problem,
        support_requested=checkin_in.support_requested,
        support_type=checkin_in.support_type,
        free_text=checkin_in.free_text
    )
    db.add(new_checkin)
    db.commit()
    db.refresh(new_checkin)

    # If support was requested during check-in, automatically create or link a support request
    if checkin_in.support_requested:
        # Determine priority based on strain and explicit request
        is_elevated = (
            checkin_in.stress_score >= 4 or
            checkin_in.overwhelmed_score >= 4 or
            checkin_in.sleep_score <= 2 or
            checkin_in.attendance_problem
        )
        priority = "Elevated" if is_elevated else "Standard"
        if checkin_in.stress_score == 5 and checkin_in.overwhelmed_score == 5 and checkin_in.sleep_score == 1:
            priority = "Urgent"

        sup_req = SupportRequest(
            student_id=student.id,
            checkin_id=new_checkin.id,
            support_type=checkin_in.support_type or "General Support",
            priority=priority,
            status="New",
            notes="Support requested directly via weekly check-in."
        )
        db.add(sup_req)
        db.commit()

    return new_checkin

@router.get("/students/{student_id}/analysis", response_model=AnalysisResponse)
def get_analysis_for_student(student_id: int, db: Session = Depends(get_db)):
    """
    Computes explainable wellbeing signal analysis for a student.
    Uses ML trend regression, multi-signal feature normalization, and NLP topic identification.
    """
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    analysis_data = get_student_analysis(db, student_id)
    return analysis_data

@router.get("/students/{student_id}/recommendations")
def get_recommendations_for_student(student_id: int, db: Session = Depends(get_db)):
    """
    Returns personalized support pathways based on student signals.
    """
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    analysis = get_student_analysis(db, student_id)
    return {
        "student_id": student_id,
        "recommended_services": analysis["recommended_support"],
        "signals_summary": analysis["signals"]
    }

from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import SupportRequest, Student, CheckIn
from ..schemas import (
    SupportRequestCreate,
    SupportRequestUpdate,
    SupportRequestResponse
)
from ..services.analysis_service import get_student_analysis

router = APIRouter(prefix="/api/support-requests", tags=["Support Requests"])

@router.post("", response_model=SupportRequestResponse)
def create_support_request(req_in: SupportRequestCreate, db: Session = Depends(get_db)):
    """Create a new student-initiated support request."""
    student = db.query(Student).filter(Student.id == req_in.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    new_req = SupportRequest(
        student_id=req_in.student_id,
        checkin_id=req_in.checkin_id,
        support_type=req_in.support_type,
        priority=req_in.priority or "Standard",
        status="New",
        notes=req_in.notes or "Student requested support via portal."
    )
    db.add(new_req)
    db.commit()
    db.refresh(new_req)

    return SupportRequestResponse(
        id=new_req.id,
        student_id=new_req.student_id,
        checkin_id=new_req.checkin_id,
        support_type=new_req.support_type,
        priority=new_req.priority,
        status=new_req.status,
        assigned_to=new_req.assigned_to,
        notes=new_req.notes,
        created_at=new_req.created_at,
        updated_at=new_req.updated_at,
        student_code=student.student_code,
        department=student.department
    )

@router.get("", response_model=List[SupportRequestResponse])
def list_support_requests(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all support requests for staff triage queue."""
    query = db.query(SupportRequest).order_by(SupportRequest.created_at.desc())

    if status and status != "All":
        query = query.filter(SupportRequest.status == status)
    if priority and priority != "All":
        query = query.filter(SupportRequest.priority == priority)

    requests = query.all()
    results = []
    for r in requests:
        st = db.query(Student).filter(Student.id == r.student_id).first()
        results.append(SupportRequestResponse(
            id=r.id,
            student_id=r.student_id,
            checkin_id=r.checkin_id,
            support_type=r.support_type,
            priority=r.priority,
            status=r.status,
            assigned_to=r.assigned_to,
            notes=r.notes,
            created_at=r.created_at,
            updated_at=r.updated_at,
            student_code=st.student_code if st else "CP-ANON",
            department=st.department if st else "General"
        ))
    return results

@router.get("/{req_id}")
def get_support_request_detail(req_id: int, db: Session = Depends(get_db)):
    """
    Returns rich case detail for staff members:
    Includes the request, student code, department, signal analysis, historical check-ins, and text classification.
    """
    req = db.query(SupportRequest).filter(SupportRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Support request not found")

    student = db.query(Student).filter(Student.id == req.student_id).first()
    analysis = get_student_analysis(db, req.student_id)
    checkin = db.query(CheckIn).filter(CheckIn.id == req.checkin_id).first() if req.checkin_id else None

    return {
        "request": {
            "id": req.id,
            "student_id": req.student_id,
            "student_code": student.student_code if student else "CP-ANON",
            "department": student.department if student else "General",
            "year": student.year if student else "Undergraduate",
            "support_type": req.support_type,
            "priority": req.priority,
            "status": req.status,
            "assigned_to": req.assigned_to,
            "notes": req.notes,
            "created_at": req.created_at.isoformat(),
            "updated_at": req.updated_at.isoformat()
        },
        "latest_checkin": {
            "stress_score": checkin.stress_score if checkin else 3,
            "sleep_score": checkin.sleep_score if checkin else 3,
            "workload_score": checkin.workload_score if checkin else 3,
            "social_connection_score": checkin.social_connection_score if checkin else 3,
            "overwhelmed_score": checkin.overwhelmed_score if checkin else 3,
            "attendance_problem": checkin.attendance_problem if checkin else False,
            "free_text": checkin.free_text if checkin else None,
            "created_at": checkin.created_at.isoformat() if checkin else None
        },
        "analysis": analysis
    }

@router.patch("/{req_id}", response_model=SupportRequestResponse)
def update_support_request(req_id: int, req_update: SupportRequestUpdate, db: Session = Depends(get_db)):
    """Update support request status, assignment, or case notes."""
    req = db.query(SupportRequest).filter(SupportRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Support request not found")

    if req_update.status is not None:
        req.status = req_update.status
    if req_update.assigned_to is not None:
        req.assigned_to = req_update.assigned_to
    if req_update.notes is not None:
        req.notes = req_update.notes
    if req_update.priority is not None:
        req.priority = req_update.priority

    req.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(req)

    student = db.query(Student).filter(Student.id == req.student_id).first()
    return SupportRequestResponse(
        id=req.id,
        student_id=req.student_id,
        checkin_id=req.checkin_id,
        support_type=req.support_type,
        priority=req.priority,
        status=req.status,
        assigned_to=req.assigned_to,
        notes=req.notes,
        created_at=req.created_at,
        updated_at=req.updated_at,
        student_code=student.student_code if student else "CP-ANON",
        department=student.department if student else "General"
    )

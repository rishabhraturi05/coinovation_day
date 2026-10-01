from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    year = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    checkins = relationship("CheckIn", back_populates="student", order_by="CheckIn.created_at.desc()")
    support_requests = relationship("SupportRequest", back_populates="student", order_by="SupportRequest.created_at.desc()")

class CheckIn(Base):
    __tablename__ = "checkins"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    stress_score = Column(Integer, nullable=False)           # 1 - 5
    sleep_score = Column(Integer, nullable=False)            # 1 - 5 (higher is better sleep)
    workload_score = Column(Integer, nullable=False)         # 1 - 5
    social_connection_score = Column(Integer, nullable=False)# 1 - 5 (higher is better connected)
    overwhelmed_score = Column(Integer, nullable=False)      # 1 - 5
    attendance_problem = Column(Boolean, default=False)      # Struggling to keep up
    support_requested = Column(Boolean, default=False)
    support_type = Column(String(100), nullable=True)        # 'Academic Support', 'Wellbeing Advisor', etc.
    free_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="checkins")
    support_requests = relationship("SupportRequest", back_populates="checkin")

class SupportRequest(Base):
    __tablename__ = "support_requests"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    checkin_id = Column(Integer, ForeignKey("checkins.id"), nullable=True)
    support_type = Column(String(100), nullable=False)       # 'Academic Support', 'Wellbeing Advisor', etc.
    priority = Column(String(50), default="Standard")        # 'Low', 'Standard', 'Elevated', 'Urgent'
    status = Column(String(50), default="New")               # 'New', 'Assigned', 'Contacted', 'Resolved'
    assigned_to = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("Student", back_populates="support_requests")
    checkin = relationship("CheckIn", back_populates="support_requests")

class SupportResource(Base):
    __tablename__ = "support_resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False)           # 'academic', 'wellbeing', 'financial', 'social', 'accommodation'
    description = Column(Text, nullable=False)
    url = Column(String(255), nullable=True)
    department = Column(String(100), nullable=False)

class StaffUser(Base):
    __tablename__ = "staff_users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)

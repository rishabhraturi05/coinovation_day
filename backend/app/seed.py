from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
from .models import Student, CheckIn, SupportRequest, SupportResource, StaffUser

def seed_database(db: Session):
    """
    Seeds initial realistic demo data if database is empty.
    Includes the primary demo student CP1042 and 20+ cohort students.
    """
    if db.query(Student).first():
        return # Already seeded

    print("Seeding CampusPulse database...")
    now = datetime.utcnow()

    # 1. Staff Users
    staff_members = [
        StaffUser(name="Dr. Sarah Jenkins", department="Student Wellbeing Services", role="Senior Wellbeing Advisor"),
        StaffUser(name="Prof. David Chen", department="Academic Advising Center", role="Academic Coordinator"),
        StaffUser(name="Priya Patel", department="Student Support Lead", role="Triage Coordinator"),
        StaffUser(name="Michael Roberts", department="Financial Aid Office", role="Financial Advisor"),
    ]
    db.add_all(staff_members)
    db.flush()

    # 2. Support Resources
    resources = [
        SupportResource(
            title="Academic Tutoring & Writing Center",
            category="academic",
            description="One-on-one peer tutoring, assignment review, and exam prep planning.",
            url="https://campus.edu/academic-support",
            department="Academic Affairs"
        ),
        SupportResource(
            title="Study Skills & Exam Time Management Workshop",
            category="academic",
            description="Practical workshops on pacing assignments, breaking down coursework, and reducing exam anxiety.",
            url="https://campus.edu/study-skills",
            department="Academic Affairs"
        ),
        SupportResource(
            title="Confidential Wellbeing Advisors",
            category="wellbeing",
            description="Confidential consultations to explore stress reduction, resilience, and personal support options.",
            url="https://campus.edu/wellbeing",
            department="Student Wellbeing"
        ),
        SupportResource(
            title="Mindfulness & Sleep Hygiene Group",
            category="wellbeing",
            description="Weekly guided sessions on sleep habits, evening decompression routines, and stress management.",
            url="https://campus.edu/sleep-mindfulness",
            department="Student Wellbeing"
        ),
        SupportResource(
            title="Student Hardship Fund & Bursary Advisory",
            category="financial",
            description="Confidential assistance for students facing unexpected financial strains or textbook/living fee pressures.",
            url="https://campus.edu/financial-aid",
            department="Financial Services"
        ),
        SupportResource(
            title="Peer Mentorship & Student Communities",
            category="social",
            description="Connect with peer mentors, student clubs, and low-pressure community coffee hours.",
            url="https://campus.edu/peer-mentors",
            department="Student Life"
        ),
        SupportResource(
            title="Campus Residence & Housing Advisory",
            category="accommodation",
            description="Assistance with dorm maintenance disputes, roommate mediation, and off-campus housing leases.",
            url="https://campus.edu/residence-support",
            department="Residential Life"
        ),
    ]
    db.add_all(resources)
    db.flush()

    # 3. Main Demo Student: Alex Rivera (CP1042)
    demo_student = Student(
        student_code="CP1042",
        name="Alex Rivera",
        department="Computer Science",
        year="2nd Year",
        created_at=now - timedelta(days=35)
    )
    db.add(demo_student)
    db.flush()

    # Four distinct weeks of check-ins matching exact hackathon scenario:
    demo_checkins = [
        CheckIn(
            student_id=demo_student.id,
            stress_score=2,
            sleep_score=4,
            workload_score=2,
            social_connection_score=4,
            overwhelmed_score=1,
            attendance_problem=False,
            support_requested=False,
            support_type=None,
            free_text="Feeling good about this semester. Classes are manageable.",
            created_at=now - timedelta(days=26)
        ),
        CheckIn(
            student_id=demo_student.id,
            stress_score=3,
            sleep_score=3,
            workload_score=3,
            social_connection_score=4,
            overwhelmed_score=2,
            attendance_problem=False,
            support_requested=False,
            support_type=None,
            free_text="Midterm schedule was announced. More assignments starting to pile up.",
            created_at=now - timedelta(days=19)
        ),
        CheckIn(
            student_id=demo_student.id,
            stress_score=4,
            sleep_score=2,
            workload_score=4,
            social_connection_score=3,
            overwhelmed_score=4,
            attendance_problem=False,
            support_requested=False,
            support_type=None,
            free_text="Hard to balance lab work and group projects. Sleeping late every night.",
            created_at=now - timedelta(days=12)
        ),
        CheckIn(
            student_id=demo_student.id,
            stress_score=5,
            sleep_score=1,
            workload_score=5,
            social_connection_score=2,
            overwhelmed_score=5,
            attendance_problem=True,
            support_requested=True,
            support_type="Academic Support",
            free_text="I have three assignments due this week and two exams coming up. I am barely sleeping and I don't know how to manage everything.",
            created_at=now - timedelta(days=5)
        )
    ]
    db.add_all(demo_checkins)
    db.flush()

    # Seed an initial support request for CP1042 corresponding to their recent check-in
    demo_support_req = SupportRequest(
        student_id=demo_student.id,
        checkin_id=demo_checkins[-1].id,
        support_type="Academic Support",
        priority="Elevated",
        status="New",
        assigned_to=None,
        notes="High workload and severe sleep decline flagged over 3 consecutive check-ins.",
        created_at=now - timedelta(days=5, hours=2)
    )
    db.add(demo_support_req)

    # 4. Seed 24 other fictional students with varied profiles
    cohort_data = [
        ("CP1011", "Jordan Lee", "Mechanical Engineering", "3rd Year", "stable"),
        ("CP1018", "Maya Sharma", "Electrical Engineering", "1st Year", "worsening_social"),
        ("CP1025", "Taylor Kim", "Computer Science", "4th Year", "urgent"),
        ("CP1033", "Samir Patel", "Civil Engineering", "2nd Year", "stable"),
        ("CP1049", "Chloe Martin", "Biotechnology", "1st Year", "improving"),
        ("CP1055", "Liam O'Connor", "First Year General", "1st Year", "worsening_academic"),
        ("CP1062", "Zara Ahmed", "Business Analytics", "3rd Year", "financial_concern"),
        ("CP1071", "Noah Wilson", "Computer Science", "2nd Year", "stable"),
        ("CP1080", "Emma Rodriguez", "Mechanical Engineering", "2nd Year", "worsening_workload"),
        ("CP1091", "Lucas Becker", "Electrical Engineering", "3rd Year", "contacted_case"),
        ("CP1104", "Sofia Rossi", "Civil Engineering", "4th Year", "resolved_case"),
        ("CP1118", "Marcus Wright", "Biotechnology", "2nd Year", "stable"),
        ("CP1129", "Aisha Khan", "Computer Science", "1st Year", "worsening_academic"),
        ("CP1142", "Ethan Brown", "Business Analytics", "2nd Year", "improving"),
        ("CP1155", "Olivia Davies", "First Year General", "1st Year", "urgent"),
        ("CP1167", "Daniel Garcia", "Mechanical Engineering", "4th Year", "stable"),
        ("CP1178", "Hanna Lindqvist", "Electrical Engineering", "2nd Year", "assigned_case"),
        ("CP1189", "Kevin Zhang", "Computer Science", "3rd Year", "worsening_workload"),
        ("CP1201", "Isabella Santos", "Civil Engineering", "1st Year", "stable"),
        ("CP1215", "James Taylor", "Biotechnology", "3rd Year", "financial_concern"),
        ("CP1228", "Fatima Al-Mansoor", "First Year General", "1st Year", "worsening_social"),
        ("CP1239", "Benjamin Scott", "Business Analytics", "4th Year", "stable"),
    ]

    for code, name, dept, yr, profile in cohort_data:
        student = Student(
            student_code=code,
            name=name,
            department=dept,
            year=yr,
            created_at=now - timedelta(days=random.randint(40, 70))
        )
        db.add(student)
        db.flush()

        # Generate 4 to 6 checkins over the past 4-6 weeks
        num_checkins = random.randint(4, 6)
        checkin_objects = []

        for i in range(num_checkins):
            days_ago = (num_checkins - i) * 7 - random.randint(0, 3)
            checkin_date = now - timedelta(days=days_ago)

            if profile == "stable":
                stress = random.choice([2, 3])
                sleep = random.choice([3, 4, 5])
                workload = random.choice([2, 3])
                social = random.choice([3, 4, 5])
                overwhelmed = random.choice([1, 2])
                struggling = False
                req_support = False
                note = "Managing coursework well this week." if i == num_checkins - 1 else None
                s_type = None

            elif profile in ["worsening_academic", "worsening_workload"]:
                # Progressive strain
                progress = i / max(1, num_checkins - 1)
                stress = min(5, 2 + int(progress * 3))
                sleep = max(1, 4 - int(progress * 2.5))
                workload = min(5, 2 + int(progress * 3))
                social = max(1, 4 - int(progress * 1.5))
                overwhelmed = min(5, 2 + int(progress * 3))
                struggling = progress > 0.6
                req_support = progress > 0.8
                s_type = "Academic Support" if req_support else None
                note = "Struggling with problem sets and heavy assignment load." if req_support else None

            elif profile == "worsening_social":
                progress = i / max(1, num_checkins - 1)
                stress = min(5, 2 + int(progress * 2))
                sleep = random.choice([3, 4])
                workload = 3
                social = max(1, 4 - int(progress * 3))
                overwhelmed = min(5, 2 + int(progress * 2))
                struggling = False
                req_support = progress > 0.7
                s_type = "Student Community" if req_support else None
                note = "Feeling very isolated and homesick lately, struggling to find friends." if req_support else None

            elif profile == "financial_concern":
                stress = 4
                sleep = 3
                workload = 3
                social = 3
                overwhelmed = 4
                struggling = False
                req_support = (i == num_checkins - 1)
                s_type = "Financial Support" if req_support else None
                note = "Worried about paying for required engineering software and hostel dues." if req_support else None

            elif profile == "improving":
                progress = i / max(1, num_checkins - 1)
                stress = max(1, 5 - int(progress * 3))
                sleep = min(5, 1 + int(progress * 3))
                workload = max(2, 4 - int(progress * 2))
                social = min(5, 2 + int(progress * 2))
                overwhelmed = max(1, 4 - int(progress * 3))
                struggling = False
                req_support = False
                s_type = None
                note = "Feeling significantly better after adjusting my study schedule." if i == num_checkins - 1 else None

            else: # urgent or assigned cases
                stress = random.choice([4, 5])
                sleep = random.choice([1, 2])
                workload = random.choice([4, 5])
                social = random.choice([1, 2, 3])
                overwhelmed = random.choice([4, 5])
                struggling = True
                req_support = True
                s_type = random.choice(["Wellbeing Advisor", "Academic Support"])
                note = "Everything is piling up and I'm really exhausted." if i == num_checkins - 1 else None

            c = CheckIn(
                student_id=student.id,
                stress_score=stress,
                sleep_score=sleep,
                workload_score=workload,
                social_connection_score=social,
                overwhelmed_score=overwhelmed,
                attendance_problem=struggling,
                support_requested=req_support,
                support_type=s_type,
                free_text=note,
                created_at=checkin_date
            )
            checkin_objects.append(c)

        db.add_all(checkin_objects)
        db.flush()

        # Seed Support Requests for cases matching criteria
        if profile in ["urgent", "assigned_case", "contacted_case", "resolved_case", "worsening_academic", "financial_concern"]:
            last_c = checkin_objects[-1]
            if profile == "urgent":
                st = "New"
                pr = "Urgent"
                asg = None
                notes = "High strain detected across multiple check-ins. Student requested urgent consultation."
            elif profile == "assigned_case":
                st = "Assigned"
                pr = "Standard"
                asg = "Dr. Sarah Jenkins"
                notes = "Assigned for academic workload planning and extension review."
            elif profile == "contacted_case":
                st = "Contacted"
                pr = "Elevated"
                asg = "Priya Patel"
                notes = "Reached out via campus email. Initial appointment scheduled for Thursday."
            elif profile == "resolved_case":
                st = "Resolved"
                pr = "Standard"
                asg = "Prof. David Chen"
                notes = "Connected with peer tutoring center; coursework timetable rearranged successfully."
            elif profile == "financial_concern":
                st = "New"
                pr = "Standard"
                asg = None
                notes = "Financial hardship guidance requested regarding term expenses."
            else:
                st = "New"
                pr = "Elevated"
                asg = None
                notes = "Workload strain flagged with academic difficulty."

            req = SupportRequest(
                student_id=student.id,
                checkin_id=last_c.id,
                support_type=last_c.support_type or "Academic Support",
                priority=pr,
                status=st,
                assigned_to=asg,
                notes=notes,
                created_at=last_c.created_at + timedelta(minutes=random.randint(5, 60))
            )
            db.add(req)

    db.commit()
    print("Database successfully seeded with realistic demo data.")

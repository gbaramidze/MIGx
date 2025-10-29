from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from .error_handling import global_exception_handler, CustomHTTPException
import uuid
import jwt
import hashlib

app = FastAPI(title="Clinical Trial API", version="1.0.0")
app.add_exception_handler(HTTPException, global_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модели Pydantic
class UserCreate(BaseModel):
    username: str
    password: str

class ParticipantCreate(BaseModel):
    subject_id: str
    study_group: str
    enrollment_date: date
    status: str
    age: int
    gender: str

class Participant(BaseModel):
    participant_id: str
    subject_id: str
    study_group: str
    enrollment_date: date
    status: str
    age: int
    gender: str

    class Config:
        from_attributes = True

# Простая аутентификация
SECRET_KEY = "your-secret-key-here-change-in-production"

def get_password_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(username: str):
    import datetime
    payload = {
        "sub": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# Mock данные
mock_users_db = {
    "researcher": {
        "username": "researcher",
        "hashed_password": get_password_hash("password123")
    }
}

# In-memory хранилище для демо
participants_db = []

@app.post("/token")
async def login(user_data: UserCreate):
    user = mock_users_db.get(user_data.username)
    if not user or get_password_hash(user_data.password) != user["hashed_password"]:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    token = create_access_token(user_data.username)
    return {"access_token": token, "token_type": "bearer"}

@app.get("/participants/", response_model=List[Participant])
def read_participants():
    return participants_db

@app.post("/participants/", response_model=Participant)
def create_participant(participant: ParticipantCreate):
    try:
        # Validate subject_id uniqueness
        existing = next((p for p in participants_db if p.subject_id == participant.subject_id), None)
        if existing:
            raise CustomHTTPException(
                status_code=400,
                detail="Subject ID already exists",
                error_code="DUPLICATE_SUBJECT_ID"
            )

        # Validate data
        if participant.age < 18 or participant.age > 100:
            raise CustomHTTPException(
                status_code=400,
                detail="Age must be between 18 and 100",
                error_code="INVALID_AGE"
            )

        if participant.study_group not in ["treatment", "control"]:
            raise CustomHTTPException(
                status_code=400,
                detail="Study group must be 'treatment' or 'control'",
                error_code="INVALID_STUDY_GROUP"
            )

        new_participant = Participant(
            participant_id=str(uuid.uuid4()),
            **participant.dict()
        )

        participants_db.append(new_participant)
        return new_participant

    except CustomHTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating participant: {str(e)}")
        raise CustomHTTPException(
            status_code=500,
            detail="Failed to create participant",
            error_code="CREATION_ERROR"
        )

@app.put("/participants/{participant_id}", response_model=Participant)
def update_participant(participant_id: str, participant_data: dict):
    """Update participant"""
    participant = next((p for p in participants_db if p.participant_id == participant_id), None)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    # Update fields
    for field, value in participant_data.items():
        if hasattr(participant, field) and field != "participant_id":
            setattr(participant, field, value)

    return participant

@app.delete("/participants/{participant_id}")
def delete_participant(participant_id: str):
    """Delete participant"""
    global participants_db
    participant = next((p for p in participants_db if p.participant_id == participant_id), None)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    participants_db = [p for p in participants_db if p.participant_id != participant_id]
    return {"message": "Participant deleted successfully"}

@app.get("/metrics/")
def get_metrics():
    total = len(participants_db)
    if total == 0:
        return {
            "total_participants": 0,
            "active_participants": 0,
            "completed_studies": 0,
            "treatment_group": 0,
            "control_group": 0,
            "average_age": 0,
            "gender_distribution": {"M": 0, "F": 0, "Other": 0}
        }

    active = len([p for p in participants_db if p.status == "active"])
    completed = len([p for p in participants_db if p.status == "completed"])
    treatment = len([p for p in participants_db if p.study_group == "treatment"])
    control = len([p for p in participants_db if p.study_group == "control"])
    avg_age = sum(p.age for p in participants_db) / total

    gender_dist = {"M": 0, "F": 0, "Other": 0}
    for p in participants_db:
        gender_dist[p.gender] += 1

    return {
        "total_participants": total,
        "active_participants": active,
        "completed_studies": completed,
        "treatment_group": treatment,
        "control_group": control,
        "average_age": round(avg_age, 1),
        "gender_distribution": gender_dist
    }

@app.get("/")
def read_root():
    return {"message": "Clinical Trial API is running"}

# Добавляем тестовые данные при запуске
@app.on_event("startup")
def startup_event():
    if not participants_db:
        sample_data = [
            Participant(
                participant_id=str(uuid.uuid4()),
                subject_id="P001",
                study_group="treatment",
                enrollment_date=date(2024, 1, 15),
                status="active",
                age=45,
                gender="M"
            ),
            Participant(
                participant_id=str(uuid.uuid4()),
                subject_id="P002",
                study_group="control",
                enrollment_date=date(2024, 1, 16),
                status="active",
                age=52,
                gender="F"
            ),
        ]
        participants_db.extend(sample_data)
        print("Sample data created")
from sqlalchemy import Column, String, Integer, Date, Enum
from .database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Participant(Base):
    __tablename__ = "participants"

    participant_id = Column(String, primary_key=True, default=generate_uuid)
    subject_id = Column(String, unique=True, index=True)
    study_group = Column(Enum("treatment", "control", name="study_group_enum"))
    enrollment_date = Column(Date)
    status = Column(Enum("active", "completed", "withdrawn", name="status_enum"))
    age = Column(Integer)
    gender = Column(Enum("M", "F", "Other", name="gender_enum"))
from pydantic import BaseModel
from datetime import date
from typing import Optional

class ParticipantBase(BaseModel):
    subject_id: str
    study_group: str
    enrollment_date: date
    status: str
    age: int
    gender: str

class ParticipantCreate(ParticipantBase):
    pass

class Participant(ParticipantBase):
    participant_id: str

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import date

from app.database import Base
from app.models import Participant

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_models.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)

def test_create_participant(db_session):
    """Test creating a participant record"""
    participant = Participant(
        subject_id="TEST001",
        study_group="treatment",
        enrollment_date=date(2024, 1, 15),
        status="active",
        age=45,
        gender="M"
    )

    db_session.add(participant)
    db_session.commit()
    db_session.refresh(participant)

    assert participant.participant_id is not None
    assert participant.subject_id == "TEST001"
    assert participant.study_group == "treatment"
    assert participant.age == 45

def test_participant_required_fields(db_session):
    """Test that required fields are enforced"""
    participant = Participant(
        subject_id="TEST002",
        study_group="control",
        enrollment_date=date(2024, 1, 16),
        status="active",
        age=35,
        gender="F"
    )

    db_session.add(participant)
    db_session.commit()

    # Verify the record was created
    saved_participant = db_session.query(Participant).filter_by(subject_id="TEST002").first()
    assert saved_participant is not None
    assert saved_participant.gender == "F"
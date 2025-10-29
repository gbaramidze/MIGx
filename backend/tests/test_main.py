import pytest
from fastapi.testclient import TestClient
from datetime import date
import json

from app.main import app
from app.simple_auth import create_access_token, verify_password, get_password_hash

client = TestClient(app)

def test_read_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Clinical Trial API is running"}

def test_login_success():
    """Test successful login"""
    response = client.post("/token", json={
        "username": "researcher",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_failure():
    """Test failed login"""
    response = client.post("/token", json={
        "username": "wrong",
        "password": "wrong"
    })
    assert response.status_code == 401

def test_get_participants():
    """Test getting participants list"""
    # First login to get token
    login_response = client.post("/token", json={
        "username": "researcher",
        "password": "password123"
    })
    token = login_response.json()["access_token"]

    # Get participants with auth
    response = client.get(
        "/participants/",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_participant():
    """Test creating a new participant"""
    login_response = client.post("/token", json={
        "username": "researcher",
        "password": "password123"
    })
    token = login_response.json()["access_token"]

    participant_data = {
        "subject_id": "TEST001",
        "study_group": "treatment",
        "enrollment_date": "2024-01-20",
        "status": "active",
        "age": 30,
        "gender": "M"
    }

    response = client.post(
        "/participants/",
        json=participant_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["subject_id"] == "TEST001"

def test_get_metrics():
    """Test metrics endpoint"""
    login_response = client.post("/token", json={
        "username": "researcher",
        "password": "password123"
    })
    token = login_response.json()["access_token"]

    response = client.get(
        "/metrics/",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "total_participants" in data
    assert "active_participants" in data
    assert "gender_distribution" in data

def test_auth_required():
    """Test that auth is required for protected routes"""
    response = client.get("/participants/")
    assert response.status_code == 401

def test_password_hashing():
    """Test password hashing function"""
    password = "test123"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed) == True
    assert verify_password("wrong", hashed) == False
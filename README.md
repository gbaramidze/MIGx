# Clinical Trial Dashboard

A full-stack application for managing clinical trial participants with real-time metrics visualization.

## 🚀 Features

- **Participant Management**: Create, view, and manage clinical trial participants
- **Real-time Metrics**: Dashboard with key trial metrics and statistics
- **Authentication**: JWT-based secure authentication
- **Responsive Design**: Mobile-friendly interface
- **RESTful API**: Clean API design with FastAPI
- **Containerized**: Docker support for easy deployment

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Development database (easily switchable to PostgreSQL)
- **JWT** - Authentication tokens
- **Pytest** - Testing framework

### Frontend
- **React 18** - UI library with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📦 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Running with Docker (Recommended)

1. **Clone and setup:**
```bash
git clone <repository>
cd clinical-trial-dashboard
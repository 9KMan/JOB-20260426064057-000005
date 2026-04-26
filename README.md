# SaaS AI Platform

A full-stack SaaS application with AI capabilities, built with React, Node.js, Python, and AWS.

## Features

- User authentication (registration/login)
- Project management
- AI-powered text analysis (sentiment, classification, entity extraction)
- Usage tracking and analytics
- PostgreSQL database
- Docker containerized deployment

## Tech Stack

- **Frontend:** React 18, CSS3
- **Backend:** Flask, Python 3.11
- **Database:** PostgreSQL
- **Deployment:** Docker, Nginx

## Quick Start

### Using Docker

```bash
cd docker
docker-compose up --build
```

Access the application at http://localhost

### Manual Setup

**Backend:**
```bash
cd backend
pip install -r requirements.txt
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/saas_ai
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://postgres:postgres@db:5432/saas_ai |
| SECRET_KEY | Flask secret key | dev-secret-key |

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/projects?user_id=<id>` - List user projects
- `POST /api/projects` - Create project
- `POST /api/ai/analyze` - Run AI analysis
- `GET /api/usage/<user_id>` - Get usage stats

## License

MIT
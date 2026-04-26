# SaaS AI Platform

A modern SaaS application with AI/ML capabilities built using React, Node.js, Python (Flask), and AWS.

## Features

- AI-powered text analysis
- Sentiment analysis
- Prediction models
- User authentication
- Project management
- Subscription handling
- AWS S3 integration
- RESTful API

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Python Flask, SQLAlchemy
- **Database**: PostgreSQL
- **Cache**: Redis
- **Cloud**: AWS (S3, EC2, RDS)
- **AI/ML**: OpenAI GPT, Anthropic Claude

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for local development)
- PostgreSQL 16+ (for local development)

### Using Docker

```bash
git clone https://github.com/9KMan/JOB-20260426064057-000005.git
cd JOB-20260426064057-000005
cp .env.example .env
docker-compose -f docker/docker-compose.yml up -d
docker-compose -f docker/docker-compose.yml logs -f
```

### Local Development

Backend:
```bash
cd backend
pip install -r requirements.txt
flask run
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/v1/health | API health |
| POST | /api/v1/analyze | Analyze text |
| POST | /api/v1/predict | ML predictions |
| POST | /api/v1/upload | File upload |
| GET | /api/v1/users | List users |
| POST | /api/v1/projects | Create project |

## Project Structure

```
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── routes.py
│   └── services/
│       ├── ai_service.py
│       └── s3_service.py
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   └── index.html
│   └── package.json
├── docker/
│   ├── docker-compose.yml
│   └── nginx.conf
└── tests/
    └── test_api.py
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| AWS_ACCESS_KEY_ID | AWS access key | Yes |
| AWS_SECRET_ACCESS_KEY | AWS secret key | Yes |
| AWS_REGION | AWS region | No |
| DATABASE_URL | PostgreSQL connection | Yes |
| REDIS_URL | Redis connection | Yes |
| OPENAI_API_KEY | OpenAI API key | Yes |
| ANTHROPIC_API_KEY | Anthropic API key | Yes |

## Testing

```bash
cd tests
pytest -v
```

## License

MIT License
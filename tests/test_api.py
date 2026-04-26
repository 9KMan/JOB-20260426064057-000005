import pytest
from app import app, db, User, Project

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

def test_health_endpoint(client):
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'

def test_register_user(client):
    response = client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'password': 'password123',
        'company_name': 'Test Co'
    })
    assert response.status_code == 201
    data = response.get_json()
    assert 'user_id' in data

def test_duplicate_email(client):
    client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'password': 'password123'
    })
    response = client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'password': 'password456'
    })
    assert response.status_code == 400

def test_login_success(client):
    client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'password': 'password123'
    })
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'password123'
    })
    assert response.status_code == 200

def test_login_failure(client):
    response = client.post('/api/auth/login', json={
        'email': 'nonexistent@example.com',
        'password': 'password123'
    })
    assert response.status_code == 401

def test_create_project(client):
    reg_response = client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'password': 'password123'
    })
    user_id = reg_response.get_json()['user_id']
    response = client.post('/api/projects', json={
        'user_id': user_id,
        'name': 'My Project',
        'description': 'Test project'
    })
    assert response.status_code == 201

def test_list_projects(client):
    reg_response = client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'password': 'password123'
    })
    user_id = reg_response.get_json()['user_id']
    client.post('/api/projects', json={
        'user_id': user_id,
        'name': 'Project 1'
    })
    response = client.get(f'/api/projects?user_id={user_id}')
    assert response.status_code == 200
    projects = response.get_json()
    assert len(projects) >= 1

def test_ai_analyze(client):
    reg_response = client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'password': 'password123'
    })
    user_id = reg_response.get_json()['user_id']
    response = client.post('/api/ai/analyze', json={
        'user_id': user_id,
        'text': 'This is a test text for analysis',
        'model_type': 'sentiment'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert 'result' in data

def test_usage_tracking(client):
    reg_response = client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'password': 'password123'
    })
    user_id = reg_response.get_json()['user_id']
    client.post('/api/ai/analyze', json={
        'user_id': user_id,
        'text': 'Test text',
        'model_type': 'sentiment'
    })
    response = client.get(f'/api/usage/{user_id}')
    assert response.status_code == 200
    data = response.get_json()
    assert 'total_tokens' in data
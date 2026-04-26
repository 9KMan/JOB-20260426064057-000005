import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    response = client.get('/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'

def test_api_health(client):
    response = client.get('/api/v1/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'ok'

def test_analyze_missing_text(client):
    response = client.post('/api/v1/analyze', json={})
    assert response.status_code == 400

def test_analyze_with_text(client):
    response = client.post('/api/v1/analyze', json={'text': 'Hello world'})
    assert response.status_code == 200
    data = response.get_json()
    assert data['result'] == 'analysis_complete'
    assert 'sentiment' in data

def test_predict(client):
    response = client.post('/api/v1/predict', json={'data': [1, 2, 3]})
    assert response.status_code == 200
    data = response.get_json()
    assert 'predictions' in data

def test_upload_no_file(client):
    response = client.post('/api/v1/upload')
    assert response.status_code == 400

def test_create_user(client):
    response = client.post('/api/v1/users', json={
        'email': 'test@example.com',
        'password': 'test123'
    })
    assert response.status_code == 201

def test_create_project_unauthorized(client):
    response = client.get('/api/v1/projects')
    assert response.status_code == 401
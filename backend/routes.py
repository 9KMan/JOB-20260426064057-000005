from flask import Blueprint, request, jsonify
from functools import wraps

api_bp = Blueprint('api', __name__, url_prefix='/api/v1')

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

@api_bp.route('/users', methods=['GET'])
@require_auth
def get_users():
    return jsonify({'users': []})

@api_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    return jsonify({
        'id': 1,
        'email': data.get('email'),
        'message': 'User created successfully'
    }), 201

@api_bp.route('/projects', methods=['GET'])
@require_auth
def get_projects():
    return jsonify({'projects': []})

@api_bp.route('/projects', methods=['POST'])
@require_auth
def create_project():
    data = request.get_json()
    return jsonify({
        'id': 1,
        'name': data.get('name'),
        'message': 'Project created successfully'
    }), 201

@api_bp.route('/analyses', methods=['POST'])
@require_auth
def create_analysis():
    data = request.get_json()
    return jsonify({
        'id': 1,
        'status': 'processing',
        'message': 'Analysis started'
    }), 201

@api_bp.route('/analyses/<int:analysis_id>', methods=['GET'])
@require_auth
def get_analysis(analysis_id):
    return jsonify({
        'id': analysis_id,
        'status': 'completed',
        'result': {'sentiment': 'positive', 'confidence': 0.95}
    })

@api_bp.route('/subscriptions', methods=['GET'])
@require_auth
def get_subscriptions():
    return jsonify({'subscriptions': []})

@api_bp.route('/subscriptions', methods=['POST'])
def create_subscription():
    data = request.get_json()
    return jsonify({
        'id': 1,
        'plan': data.get('plan'),
        'status': 'active',
        'message': 'Subscription created'
    }), 201
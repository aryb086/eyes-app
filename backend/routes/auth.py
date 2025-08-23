from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId
from datetime import datetime, timedelta
import jwt
import bcrypt
from extensions import mongo

# Create blueprint
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['username', 'email', 'password', 'fullName']
    for field in required_fields:
        if field not in data or not str(data[field]).strip():
            return jsonify({'message': f'{field} is required'}), 400
    
    # Check if user already exists
    if mongo.db.users.find_one({'email': data['email']}):
        return jsonify({'message': 'Email already registered'}), 400
    
    if mongo.db.users.find_one({'username': data['username']}):
        return jsonify({'message': 'Username already taken'}), 400
    
    # Hash password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), salt)
    
    # Create user
    user = {
        'fullName': data['fullName'],
        'username': data['username'],
        'email': data['email'].lower(),
        'password': hashed_password.decode('utf-8'),
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
    }
    
    # Insert user into database
    result = mongo.db.users.insert_one(user)
    
    # Generate JWT token
    token = jwt.encode(
        {'user_id': str(result.inserted_id), 'exp': datetime.utcnow() + timedelta(days=30)},
        current_app.config['JWT_SECRET'],
        algorithm='HS256'
    )
    
    # Return success response with token
    return jsonify({
        'message': 'User registered successfully',
        'token': token,
        'user': {
            'id': str(result.inserted_id),
            'username': user['username'],
            'email': user['email'],
            'fullName': user['fullName']
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Validate required fields
    if not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400
    
    # Find user by email (case-insensitive)
    user = mongo.db.users.find_one({'email': data['email'].lower()})
    if not user:
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Check password
    if not bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Update last login time
    mongo.db.users.update_one(
        {'_id': user['_id']},
        {'$set': {'lastLogin': datetime.utcnow()}}
    )
    
    # Generate JWT token
    token = jwt.encode(
        {'user_id': str(user['_id']), 'exp': datetime.utcnow() + timedelta(days=30)},
        current_app.config['JWT_SECRET'],
        algorithm='HS256'
    )
    
    # Return success response
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': str(user['_id']),
            'username': user['username'],
            'email': user['email'],
            'fullName': user['fullName']
        }
    }), 200

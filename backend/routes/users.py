from functools import wraps
from flask import Blueprint, request, jsonify, current_app, g
from bson import ObjectId
from datetime import datetime
import jwt
from extensions import mongo

users_bp = Blueprint('users', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check if token is in the headers
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
            
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
            
        try:
            data = jwt.decode(token, current_app.config['JWT_SECRET'], algorithms=["HS256"])
            current_user = mongo.db.users.find_one({'_id': ObjectId(data['user_id'])})
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
            g.current_user = current_user
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

@users_bp.route('/me', methods=['GET'])
@token_required
def get_me(current_user):
    try:
        # Remove sensitive data before sending response
        user = {
            'id': str(current_user['_id']),
            'username': current_user['username'],
            'email': current_user['email'],
            'fullName': current_user.get('fullName', ''),
            'bio': current_user.get('bio', ''),
            'profilePicture': current_user.get('profilePicture', ''),
            'followers': [str(follower) for follower in current_user.get('followers', [])],
            'following': [str(following) for following in current_user.get('following', [])],
            'createdAt': current_user.get('createdAt', datetime.utcnow())
        }
        
        return jsonify(user), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@users_bp.route('/<user_id>', methods=['GET'])
@token_required
def get_user(current_user, user_id):
    try:
        user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        # Remove sensitive data
        user_data = {
            'id': str(user['_id']),
            'username': user['username'],
            'fullName': user.get('fullName', ''),
            'bio': user.get('bio', ''),
            'profilePicture': user.get('profilePicture', ''),
            'followers': [str(follower) for follower in user.get('followers', [])],
            'following': [str(following) for following in user.get('following', [])],
            'createdAt': user.get('createdAt', datetime.utcnow())
        }
        
        return jsonify(user_data), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@users_bp.route('/<user_id>/follow', methods=['POST'])
@token_required
def follow_user(current_user, user_id):
    try:
        # Check if user is trying to follow themselves
        if str(current_user['_id']) == user_id:
            return jsonify({'message': 'You cannot follow yourself'}), 400
            
        # Check if target user exists
        target_user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        if not target_user:
            return jsonify({'message': 'User not found'}), 404
            
        current_user_id = ObjectId(current_user['_id'])
        target_user_id = ObjectId(user_id)
        
        # Check if already following
        if target_user_id in current_user.get('following', []):
            # Unfollow
            mongo.db.users.update_one(
                {'_id': current_user_id},
                {'$pull': {'following': target_user_id}}
            )
            mongo.db.users.update_one(
                {'_id': target_user_id},
                {'$pull': {'followers': current_user_id}}
            )
            return jsonify({'message': 'User unfollowed', 'following': False}), 200
        else:
            # Follow
            mongo.db.users.update_one(
                {'_id': current_user_id},
                {'$addToSet': {'following': target_user_id}},
                upsert=True
            )
            mongo.db.users.update_one(
                {'_id': target_user_id},
                {'$addToSet': {'followers': current_user_id}},
                upsert=True
            )
            return jsonify({'message': 'User followed', 'following': True}), 200
            
    except Exception as e:
        return jsonify({'message': str(e)}), 500

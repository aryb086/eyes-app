from functools import wraps
from flask import Blueprint, request, jsonify, current_app, g
from bson import ObjectId
from datetime import datetime
import jwt
from extensions import mongo

posts_bp = Blueprint('posts', __name__)

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

@posts_bp.route('', methods=['POST'])
@posts_bp.route('/', methods=['POST'])
@token_required
def create_post(current_user):
    try:
        data = request.get_json()
        
        if not data.get('content'):
            return jsonify({'message': 'Post content is required'}), 400
        
        post = {
            'content': data['content'],
            'images': data.get('images', []),
            'author': ObjectId(current_user['_id']),
            'visibility': data.get('visibility', 'neighborhood'),  # Default to neighborhood
            'likes': [],
            'comments': [],
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        post_id = mongo.db.posts.insert_one(post).inserted_id
        
        return jsonify({
            'message': 'Post created successfully',
            'postId': str(post_id)
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@posts_bp.route('', methods=['GET'])
@posts_bp.route('/', methods=['GET'])
@token_required
def get_posts(current_user):
    try:
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('limit', 10))
        skip = (page - 1) * per_page
        
        # Get visibility filter from query params
        visibility = request.args.get('visibility')
        
        # Get posts from users that current_user follows
        following = current_user.get('following', []) + [ObjectId(current_user['_id'])]
        
        # Build match query
        match_query = {'author': {'$in': following}}
        
        # Add visibility filter if provided
        if visibility in ['city', 'neighborhood']:
            match_query['visibility'] = visibility
        
        # Query posts with pagination
        posts_cursor = mongo.db.posts.aggregate([
            {'$match': match_query},
            {'$sort': {'createdAt': -1}},
            {'$skip': skip},
            {'$limit': per_page},
            {'$lookup': {
                'from': 'users',
                'localField': 'author',
                'foreignField': '_id',
                'as': 'author_info'
            }},
            {'$unwind': '$author_info'},
            {'$project': {
                'content': 1,
                'images': 1,
                'likes': 1,
                'comments': 1,
                'createdAt': 1,
                'author': {
                    'id': '$author_info._id',
                    'username': '$author_info.username',
                    'fullName': '$author_info.fullName',
                    'profilePicture': '$author_info.profilePicture'
                }
            }}
        ])
        
        posts = list(posts_cursor)
        
        # Convert ObjectId to string for JSON serialization
        for post in posts:
            post['_id'] = str(post['_id'])
            post['author']['id'] = str(post['author']['id'])
            post['likes'] = [str(like) for like in post.get('likes', [])]
            
            # Format comments
            for comment in post.get('comments', []):
                if 'user' in comment and isinstance(comment['user'], ObjectId):
                    comment['user'] = str(comment['user'])
        
        return jsonify(posts), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@posts_bp.route('/<post_id>/like', methods=['POST'])
@posts_bp.route('/<post_id>/like/', methods=['POST'])
@token_required
def like_post(current_user, post_id):
    try:
        post = mongo.db.posts.find_one({'_id': ObjectId(post_id)})
        if not post:
            return jsonify({'message': 'Post not found'}), 404
        
        user_id = ObjectId(current_user['_id'])
        
        # Toggle like
        if user_id in post.get('likes', []):
            mongo.db.posts.update_one(
                {'_id': ObjectId(post_id)},
                {'$pull': {'likes': user_id}}
            )
            return jsonify({'message': 'Post unliked', 'liked': False}), 200
        else:
            mongo.db.posts.update_one(
                {'_id': ObjectId(post_id)},
                {'$addToSet': {'likes': user_id}},
                upsert=True
            )
            return jsonify({'message': 'Post liked', 'liked': True}), 200
            
    except Exception as e:
        return jsonify({'message': str(e)}), 500

from flask import Flask, jsonify, request
from flask_cors import CORS
from bson import ObjectId
from datetime import datetime, timedelta
import jwt
import os
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import bcrypt
from extensions import mongo

# Import blueprints
from routes.auth import auth_bp
from routes.posts import posts_bp
from routes.users import users_bp
from routes.locations import locations_bp

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "x-access-token"],
            "supports_credentials": True
        }
    })

    # Configuration
    app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/social_media')
    app.config['JWT_SECRET'] = os.getenv('JWT_SECRET', 'your-secret-key-here')
    app.config['UPLOAD_FOLDER'] = 'uploads'
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

    # Initialize extensions
    mongo.init_app(app)

    # JWT decorator
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
                data = jwt.decode(token, app.config['JWT_SECRET'], algorithms=["HS256"])
                current_user = mongo.db.users.find_one({'_id': ObjectId(data['user_id'])})
                if not current_user:
                    return jsonify({'message': 'User not found!'}), 401
            except Exception as e:
                return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
                
            return f(current_user, *args, **kwargs)
        return decorated
    
    # Make token_required available to blueprints
    app.token_required = token_required
    
    # Import blueprints
    from routes.auth import auth_bp
    from routes.posts import posts_bp
    from routes.users import users_bp
    
    # Register blueprints with proper URL prefixes
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(posts_bp, url_prefix='/api/posts')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    # Locations blueprint already has /api prefix in its routes
    app.register_blueprint(locations_bp)
    
    # Create indexes
    with app.app_context():
        # Create a unique index on city names (case-insensitive)
        mongo.db.cities.create_index('name_lower', unique=True)
        # Create an index on neighborhoods.id for faster lookups
        mongo.db.cities.create_index('neighborhoods.id')
    
    # Health check route
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy'}), 200
    
    # Create uploads directory if it doesn't exist
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    
    return app

# Create the application
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)

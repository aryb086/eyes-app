from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from extensions import mongo
from bson.errors import InvalidId

locations_bp = Blueprint('locations', __name__)

@locations_bp.route('/api/locations/cities', methods=['GET'])
def get_cities():
    """Get a list of all available cities"""
    try:
        cities = list(mongo.db.cities.find({}, {'neighborhoods': 0}))
        for city in cities:
            city['_id'] = str(city['_id'])
        return jsonify(cities)
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@locations_bp.route('/api/locations/cities/<city_id>/neighborhoods', methods=['GET'])
def get_neighborhoods(city_id):
    """Get neighborhoods for a specific city"""
    try:
        city = mongo.db.cities.find_one(
            {'_id': ObjectId(city_id)},
            {'neighborhoods': 1, 'name': 1}
        )
        if not city:
            return jsonify({'message': 'City not found'}), 404
            
        return jsonify({
            'city_id': str(city['_id']),
            'city_name': city.get('name', ''),
            'neighborhoods': city.get('neighborhoods', [])
        })
    except InvalidId:
        return jsonify({'message': 'Invalid city ID'}), 400
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@locations_bp.route('/api/locations/cities', methods=['POST'])
def create_city():
    """Create a new city"""
    data = request.get_json()
    
    # Validate required fields
    if not data.get('name'):
        return jsonify({'message': 'City name is required'}), 400
    
    try:
        # Check if city already exists
        existing_city = mongo.db.cities.find_one({'name_lower': data['name'].lower()})
        if existing_city:
            return jsonify({
                'message': 'City already exists',
                'city_id': str(existing_city['_id'])
            }), 400
        
        # Create new city
        city_data = {
            'name': data['name'],
            'name_lower': data['name'].lower(),
            'state': data.get('state', ''),
            'country': data.get('country', 'USA'),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'neighborhoods': []
        }
        
        result = mongo.db.cities.insert_one(city_data)
        city_data['_id'] = str(result.inserted_id)
        city_data.pop('name_lower', None)
        
        return jsonify({
            'message': 'City created successfully',
            'city': city_data
        }), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@locations_bp.route('/api/locations/cities/<city_id>/neighborhoods', methods=['POST'])
def add_neighborhood(city_id):
    """Add a neighborhood to a city"""
    data = request.get_json()
    
    # Validate required fields
    if not data.get('name'):
        return jsonify({'message': 'Neighborhood name is required'}), 400
    
    try:
        # Check if city exists
        city = mongo.db.cities.find_one({'_id': ObjectId(city_id)})
        if not city:
            return jsonify({'message': 'City not found'}), 404
        
        # Check if neighborhood already exists
        neighborhood_name = data['name'].strip()
        neighborhood_lower = neighborhood_name.lower()
        
        for neighborhood in city.get('neighborhoods', []):
            if neighborhood.get('name_lower') == neighborhood_lower:
                return jsonify({
                    'message': 'Neighborhood already exists in this city',
                    'neighborhood': neighborhood
                }), 400
        
        # Create new neighborhood
        new_neighborhood = {
            'id': str(ObjectId()),
            'name': neighborhood_name,
            'name_lower': neighborhood_lower,
            'created_at': datetime.utcnow(),
            'member_count': 0
        }
        
        # Add neighborhood to city
        mongo.db.cities.update_one(
            {'_id': ObjectId(city_id)},
            {'$push': {'neighborhoods': new_neighborhood}}
        )
        
        # Remove internal fields from response
        response_neighborhood = new_neighborhood.copy()
        response_neighborhood.pop('name_lower', None)
        
        return jsonify({
            'message': 'Neighborhood added successfully',
            'neighborhood': response_neighborhood
        }), 201
    except InvalidId:
        return jsonify({'message': 'Invalid city ID'}), 400
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@locations_bp.route('/api/users/<user_id>/location', methods=['PUT'])
def update_user_location(user_id):
    """Update a user's city and neighborhood"""
    data = request.get_json()
    
    # Validate required fields
    if not data.get('city_id') or not data.get('neighborhood_id'):
        return jsonify({'message': 'City ID and Neighborhood ID are required'}), 400
    
    try:
        # Check if user exists
        user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Check if city exists and contains the neighborhood
        city = mongo.db.cities.find_one(
            {'_id': ObjectId(data['city_id']), 'neighborhoods.id': data['neighborhood_id']},
            {'name': 1, 'neighborhoods.$': 1}
        )
        
        if not city:
            return jsonify({'message': 'City or neighborhood not found'}), 404
        
        # Get neighborhood name
        neighborhood = next(
            (n for n in city['neighborhoods'] if n['id'] == data['neighborhood_id']),
            None
        )
        
        if not neighborhood:
            return jsonify({'message': 'Neighborhood not found'}), 404
        
        # Update user's location
        update_data = {
            'location': {
                'city_id': data['city_id'],
                'city_name': city['name'],
                'neighborhood_id': data['neighborhood_id'],
                'neighborhood_name': neighborhood['name']
            },
            'updated_at': datetime.utcnow()
        }
        
        mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        
        # Update neighborhood member count
        mongo.db.cities.update_one(
            {'_id': ObjectId(data['city_id']), 'neighborhoods.id': data['neighborhood_id']},
            {'$inc': {'neighborhoods.$.member_count': 1}}
        )
        
        return jsonify({
            'message': 'Location updated successfully',
            'location': update_data['location']
        })
    except InvalidId:
        return jsonify({'message': 'Invalid ID format'}), 400
    except Exception as e:
        return jsonify({'message': str(e)}), 500

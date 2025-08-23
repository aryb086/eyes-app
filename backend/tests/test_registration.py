import unittest
import json
from app import create_app
from extensions import mongo
from bson import ObjectId
from datetime import datetime, timedelta
import jwt

class TestRegistration(unittest.TestCase):    
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()
        
        # Clear test data
        with self.app.app_context():
            mongo.db.users.delete_many({})
    
    def test_successful_registration(self):
        """Test successful user registration"""
        test_user = {
            'fullName': 'Test User',
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'Test@123'
        }
        
        response = self.client.post(
            '/api/auth/register',
            data=json.dumps(test_user),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertIn('token', data)
        self.assertIn('user', data)
        self.assertEqual(data['user']['email'], 'test@example.com')
        self.assertEqual(data['user']['username'], 'testuser')
        self.assertEqual(data['user']['fullName'], 'Test User')
        self.assertNotIn('password', data['user'])
    
    def test_missing_required_fields(self):
        """Test registration with missing required fields"""
        test_user = {
            'username': 'testuser',
            'email': 'test@example.com'
            # Missing fullName and password
        }
        
        response = self.client.post(
            '/api/auth/register',
            data=json.dumps(test_user),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('message', data)
        self.assertIn('is required', data['message'])
    
    def test_duplicate_email(self):
        """Test registration with duplicate email"""
        # First registration
        test_user1 = {
            'fullName': 'Test User 1',
            'username': 'testuser1',
            'email': 'duplicate@example.com',
            'password': 'Test@123'
        }
        self.client.post(
            '/api/auth/register',
            data=json.dumps(test_user1),
            content_type='application/json'
        )
        
        # Second registration with same email
        test_user2 = {
            'fullName': 'Test User 2',
            'username': 'testuser2',
            'email': 'duplicate@example.com',
            'password': 'Test@123'
        }
        response = self.client.post(
            '/api/auth/register',
            data=json.dumps(test_user2),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Email already registered')
    
    def test_duplicate_username(self):
        """Test registration with duplicate username"""
        # First registration
        test_user1 = {
            'fullName': 'Test User 1',
            'username': 'duplicate_user',
            'email': 'test1@example.com',
            'password': 'Test@123'
        }
        self.client.post(
            '/api/auth/register',
            data=json.dumps(test_user1),
            content_type='application/json'
        )
        
        # Second registration with same username
        test_user2 = {
            'fullName': 'Test User 2',
            'username': 'duplicate_user',
            'email': 'test2@example.com',
            'password': 'Test@123'
        }
        response = self.client.post(
            '/api/auth/register',
            data=json.dumps(test_user2),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Username already taken')
    
    def test_password_hashing(self):
        """Test that passwords are properly hashed"""
        test_user = {
            'fullName': 'Test User',
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'Test@123'
        }
        
        response = self.client.post(
            '/api/auth/register',
            data=json.dumps(test_user),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        
        # Verify password is hashed in the database
        with self.app.app_context():
            user = mongo.db.users.find_one({'email': 'test@example.com'})
            self.assertIsNotNone(user)
            self.assertNotEqual(user['password'], 'Test@123')  # Should be hashed
            self.assertTrue(len(user['password']) > 30)  # Hashed password should be long

if __name__ == '__main__':
    unittest.main()

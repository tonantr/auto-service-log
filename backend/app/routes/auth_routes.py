import logging
from flask import Blueprint, request, jsonify
from app.utils.auth_utils import authenticate
from app.utils.logging_config import logger

auth_bp = Blueprint("auth_routes", __name__)


@auth_bp.route("/", methods=["POST"])
def login():
    data = request.json  
    
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify(message="Username and password are required"), 400

    try:
        success, access_token, role, username = authenticate(username, password)

        if success:
            return jsonify(access_token=access_token, role=role, username=username), 200
        else:
            logger.warning(f"Invalid login attempt for username: {username}")
            return jsonify(message="Invalid credentials"), 401
    except Exception as e:
        logger.error(f"Error during login: {e}")
        return jsonify(message="An error occurred while processing your request"), 500

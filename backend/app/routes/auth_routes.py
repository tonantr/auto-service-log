import logging
from flask import Blueprint, request, jsonify
from app.utils.auth_utils import authenticate

auth_bp = Blueprint("auth_routes", __name__)

logging.basicConfig(
    filename="app.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(module)s - Line: %(lineno)d - %(message)s",
)


@auth_bp.route("/", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    if not username or not password:
        return jsonify(message="Username and password are required"), 400

    try:
        success, access_token, role, username = authenticate(username, password)

        if success:
            return jsonify(access_token=access_token, role=role, username=username), 200
        else:
            return jsonify(message="Invalid credentials"), 401
    except Exception as e:
        logging.error(f"Error during login: {e}")
        return jsonify(message="An error occurred while processing your request"), 500

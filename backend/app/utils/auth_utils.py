from flask import request, jsonify
import jwt
import os
import datetime
from functools import wraps
from bcrypt import hashpw, gensalt, checkpw
from app.models.user import User
from app.database.database import db
from app.utils.logging_config import logger

SECRET_KEY = os.getenv("FLASK_SECRET_KEY")


def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]

        if not token:
            return jsonify({"message": "Token is missing!"}), 403

        try:
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            username = decoded_token["username"]

            current_user = User.query.filter_by(username=username).first()

            if not current_user:
                return jsonify({"message": "User not found!"}), 404
            
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token!"}), 403

        return f(current_user, *args, **kwargs)

    return decorated_function


def hash_password(password):
    salt = gensalt()
    hashed_password = hashpw(password.encode(), salt)
    return hashed_password.decode("utf-8")


def verify_password(password, hashed_password):
    return checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


def is_password_plaintext(password):
    return len(password) < 60


def update_password(username, hashed_password):
    try:
        user = User.query.filter_by(username=username).first()

        if user:
            user.password = hashed_password
            db.session.commit()

    except Exception as e:
        logger.error(f"Error in update_password: {e}")


def generate_token(username):
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    payload = {
        "username": username,
        "exp": expiration,
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return token


def authenticate(username, password):
    try:
        user = User.query.filter_by(username=username).first()

        if not user:
            logger.warning(f"User '{username}' not found")
            return False, None, None, None

        if user:
            stored_password = user.password
            if is_password_plaintext(stored_password):
                hashed_password = hash_password(stored_password)
                update_password(username, hashed_password)
                stored_password = hashed_password

            if verify_password(password, stored_password):
                role = user.role
                access_token = generate_token(username)
                return True, access_token, role, username
            
            logger.warning(f"Incorrect password for user '{username}'")
            return False, None, None, None
    except Exception as e:
        logger.error(f"Error in authenticate: {e}")
        return False, None, None, None

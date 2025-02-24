import logging
import jwt
import os
import datetime
from bcrypt import hashpw, gensalt, checkpw
from app.models.user import User
from app.database.database import db

SECRET_KEY = os.getenv("FLASK_SECRET_KEY")

logging.basicConfig(
    filename="app.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(module)s - Line: %(lineno)d - %(message)s",
)


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
        logging.error(f"Error in update_password: {e}")


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

        if user:
            stored_password = user.password
            if is_password_plaintext(stored_password):
                hashed_password = hash_password(stored_password)
                update_password(username, hashed_password)
                stored_password = hashed_password

            if verify_password(password, stored_password):
                role = user.role
                access_token = generate_token(username)
                return True, access_token, role
            else:
                return False, None, None
        else:
            return False, None
    except Exception as e:
        logging.error(f"Error in authenticate: {e}")
        return False, None

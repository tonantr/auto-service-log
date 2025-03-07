import os
from dotenv import load_dotenv


load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "defaultsecretkey5555")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URI", f"sqlite:///{os.path.join(BASE_DIR, 'auto_service.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    DEBUG = os.getenv("DEBUG", "False").lower() == "true"

    FLASK_HOST = os.getenv("FLASK_HOST", "127.0.0.1")
    FLASK_PORT = int(os.getenv("FLASK_PORT", 5001))
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "False").lower() == "true"


class DevelopmentConfig(Config):
    DEBUG = True
    FLASK_DEBUG = True
    FLASK_HOST = "127.0.0.1"
    FLASK_PORT = 5001


class ProductionConfig(Config):
    DEBUG = False
    FLASK_HOST = "0.0.0.0"
    FLASK_PORT = 8080
    FLASK_DEBUG = False

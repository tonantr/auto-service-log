import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = "P@ssw0rd5555"

    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'auto_service.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    DEBUG = False

    FLASK_HOST = "127.0.0.1"
    FLASK_PORT = 5001
    FLASK_DEBUG = False


class DevelopmentConfig(Config):
    DEBUG = True
    FLASK_DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
    FLASK_HOST = "0.0.0.0"
    FLASK_PORT = 8000
    FLASK_DEBUG = False

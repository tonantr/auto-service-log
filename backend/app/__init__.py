from flask import Flask
from config import Config
from flask_cors import CORS
from routes.admin_routes import admin_bp


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app)

    app.register_blueprint(admin_bp, url_prefix='/admin')

    return app

from flask import Flask
from config import Config
from flask_cors import CORS
from app.routes.admin_routes import admin_bp
from app.database.database import db


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)

    CORS(app)

    app.register_blueprint(admin_bp, url_prefix='/admin')

    return app

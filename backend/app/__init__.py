import logging
import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from app.routes.admin_routes import admin_bp
from app.routes.user_routes import user_bp
from app.routes.auth_routes import auth_bp
from app.database.database import db
from config import DevelopmentConfig, ProductionConfig


def create_app(config_class=ProductionConfig):
    if config_class is None:
        raise ValueError("No configuration class provided")

    app = Flask(__name__, static_folder="app/build", static_url_path="")

    @app.route("/")
    def serve_react():
        index_path = os.path.join(os.getcwd(), "app/build", "index.html")

        if os.path.exists(index_path):
            return send_from_directory(
                os.path.join(os.getcwd(), "app/build"), "index.html"
            )

    @app.route("/static/<path:path>")
    def serve_static_files(path):
        static_path = os.path.join(os.getcwd(), "app/build/static", path)

        if os.path.exists(static_path):
            return send_from_directory(
                os.path.join(os.getcwd(), "app/build/static"), path
            )

    app.config.from_object(config_class)

    flask_logger = logging.getLogger("werkzeug")
    flask_logger.setLevel(logging.WARNING)

    db.init_app(app)

    CORS(app)

    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(user_bp, url_prefix="/user")
    app.register_blueprint(auth_bp, url_prefix="/")

    return app

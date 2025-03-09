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

    app = Flask(__name__, static_folder='app/build', static_url_path='')

    app.logger.setLevel(logging.DEBUG)

    @app.route("/")
    def serve_react():
        index_path = os.path.join(os.getcwd(), 'app/build', 'index.html')
        app.logger.debug(f"Attempting to serve index.html from: {index_path}")

        if os.path.exists(index_path):
            app.logger.debug("Found index.html, serving it.")
            return send_from_directory(os.path.join(os.getcwd(), 'app/build'), 'index.html')
        else:
            app.logger.error(f"index.html not found at: {index_path}")
            return "index.html not found!", 404

    @app.route('/static/<path:path>')
    def serve_static_files(path):
        static_path = os.path.join(os.getcwd(), 'app/build/static', path)
        app.logger.debug(f"Attempting to serve static file from: {static_path}")

        if os.path.exists(static_path):
            app.logger.debug(f"Found static file: {path}, serving it.")
            return send_from_directory(os.path.join(os.getcwd(), 'app/build/static'), path)
        else:
            app.logger.error(f"Static file not found: {path} at {static_path}")
            return f"Static file {path} not found!", 404

    
    app.config.from_object(config_class)

    flask_logger = logging.getLogger('werkzeug')
    flask_logger.setLevel(logging.WARNING) 

    db.init_app(app)

    CORS(app)

    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(auth_bp, url_prefix='/')

    return app

import logging
from flask import Flask
from flask_cors import CORS
from app.routes.admin_routes import admin_bp
from app.routes.user_routes import user_bp
from app.routes.auth_routes import auth_bp
from app.database.database import db


def create_app(config_class=None):
    if config_class is None:
        raise ValueError("No configuration class provided")
    
    app = Flask(__name__)
    app.config.from_object(config_class)

    logging.basicConfig(
        filename="app.log",
        level=logging.WARNING,  
        format="%(asctime)s - %(levelname)s - %(module)s - Line: %(lineno)d - %(message)s",
    )

    flask_logger = logging.getLogger('werkzeug')
    flask_logger.setLevel(logging.WARNING) 

    db.init_app(app)

    CORS(app)

    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(auth_bp, url_prefix='/')

    return app

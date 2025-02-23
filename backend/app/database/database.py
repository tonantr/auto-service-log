from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Database:
    def __init__(self, app=None):
        if app is not None:
            self.init_app(app)
    
    def init_app(self, app):
        db.init_app(app)
    
    def create_all(self):
        with db.app.app_context():
            db.create_all()
    
    def drop_all(self):
        with db.app.app_context():
            db.drop_all()
from flask_sqlalchemy import SQLALchemy

db = SQLALchemy()

class Database:
    def __init__(self, app=None):
        if app is not None:
            self.init_app(app)
    
    def init_app(self, app):
        db.init_app(app)
    
    def create_all(self):
        db.create_all()
    
    def drop_all(self):
        db.drop_all()
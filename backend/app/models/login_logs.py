from app.database.database import db


class LoginLogs(db.Model):
    __tablename__ = "login_logs"

    log_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    login_time = db.Column(db.DateTime, default=db.func.now(), nullable=False)
    logout_time = db.Column(db.DateTime, nullable=True)
    ip_address = db.Column(db.String(45))

    user = db.relationship('User', back_populates='login_logs')

    def to_dict(self):
        return {
            "log_id": self.log_id,
            "user_id": self.user_id,
            "login_time": self.login_time,
            "logout_time": self.logout_time,
            "ip_address": self.ip_address,
        }

    def __repr__(self):
        return str(self.to_dict())
from database import db

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    # One-to-one relationship with UserData
    data = db.relationship('UserData', backref='user', uselist=False)

    def to_dict(self):
        return {"id": self.id, "username": self.username}

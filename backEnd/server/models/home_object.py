from database import db

class HomeObject(db.Model):
    __tablename__ = 'home_object'
    id = db.Column(db.Integer, primary_key=True)
    user_data_id = db.Column(db.Integer, db.ForeignKey('user_data.id'), nullable=True)
    type = db.Column(db.String(50))  # Type of home object (e.g., 'decor', 'temporary', etc.)
    object_id = db.Column(db.Integer)  # ID of the specific object in the catalog
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_data_id": self.user_data_id,
            "type": self.type,
            "object_id": self.object_id
        }
    
    @classmethod
    def process_json(cls, home_object_data, user_data_id):
        """
        Given a dictionary of home object data and a parent user_data_id,
        either update an existing home object (if "id" exists) or create a new one.
        """
        if "id" in home_object_data:
            home_obj = cls.query.get(home_object_data["id"])
            if home_obj and home_obj.user_data_id == user_data_id:
                # Update existing home object
                home_obj.type = home_object_data.get("type", home_obj.type)
                home_obj.object_id = home_object_data.get("object_id", home_obj.object_id)
                return home_obj
        
        # Create new home object
        new_home_obj = cls(
            user_data_id=user_data_id,
            type=home_object_data.get("type"),
            object_id=home_object_data.get("object_id")
        )
        db.session.add(new_home_obj)
        return new_home_obj

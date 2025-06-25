from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ---------------------------
# Models
# ---------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    # One-to-one relationship with UserData
    data = db.relationship('UserData', backref='user', uselist=False)

    def to_dict(self):
        return {"id": self.id, "username": self.username}

class UserData(db.Model):
    __tablename__ = 'user_data'
    # Use the same primary key as the User id
    id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    completed_tutorial = db.Column(db.Boolean, default=False)
    # One-to-many relationship with pets
    pets = db.relationship('pet', backref='user_data', lazy=True)

    def to_dict(self):
        return {
            "completed_tutorial": self.completed_tutorial,
            "pets": [pet.to_dict() for pet in self.pets]
        }

class pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_data_id = db.Column(db.Integer, db.ForeignKey('user_data.id'), nullable=True)
    evolution_line = db.Column(db.Integer, default=0)
    evolution_stage = db.Column(db.Integer, default=0) # combine with evolution_line to form evol_ID
    name = db.Column(db.String(50))
    level = db.Column(db.Integer, default=1)    
    xp = db.Column(db.Integer, default=0)
    hunger = db.Column(db.Float, default=0.5) # float from 0 - 1
    happiness = db.Column(db.Float, default=0.5) # float from 0 - 1
    abilities = db.Column(db.String(200), default="") # comma-separated string
    created_at = db.Column(db.BigInteger, nullable=True) # timestamp in milliseconds

    def to_dict(self):
        return {
            "id": self.id,
            "user_data_id": self.user_data_id,
            "evolution_id": [self.evolution_stage, self.evolution_line],
            "name": self.name,
            "level": self.level,
            "xp": self.xp,
            "hunger": self.hunger,
            "happiness": self.happiness,
            "abilities": self.abilities.split(",") if self.abilities else [],
            "createdAt": self.created_at
        }

    @classmethod
    def process_json(cls, pet_data, user_data_id):
        """
        Given a dictionary of pet data and a parent user_data_id,
        either update an existing pet (if "id" exists) or create a new one.
        """
        print('unpacking pet...')        # If an id is provided, try to fetch and update an existing pet.
        if "id" in pet_data:
            pet = cls.query.get(pet_data["id"])
            if pet and pet.user_data_id == user_data_id:
                pet.name = pet_data.get("name", pet.name)
                pet.level = pet_data.get("level", pet.level)
                pet.xp = pet_data.get("xp", pet.xp)
                pet.hunger = pet_data.get("hunger", pet.hunger)
                pet.happiness = pet_data.get("happiness", pet.happiness)
                pet.created_at = pet_data.get("createdAt", pet.created_at)
                # Handle abilities: if provided as a list, join into a comma-separated string.
                abilities = pet_data.get("abilities")
                if abilities is not None:
                    if isinstance(abilities, list):
                        pet.abilities = ",".join(abilities)
                    else:
                        pet.abilities = abilities
                # Process evolution identifier if provided.
                evolution_id = pet_data.get("evolution_id")
                if evolution_id and isinstance(evolution_id, list) and len(evolution_id) == 2:
                    pet.evolution_stage, pet.evolution_line = evolution_id
                return pet        # Otherwise, create a new pet.
        name = pet_data.get("name")
        level = pet_data.get("level", 1)
        xp = pet_data.get("xp", 0)
        hunger = pet_data.get("hunger", 0.5)
        happiness = pet_data.get("happiness", 0.5)
        created_at = pet_data.get("createdAt")
        abilities = pet_data.get("abilities", [])
        if isinstance(abilities, list):
            abilities = ",".join(abilities)
        evolution_id = pet_data.get("evolution_id", [0, 0])
        if isinstance(evolution_id, list) and len(evolution_id) == 2:
            evolution_stage, evolution_line = evolution_id
        else:
            evolution_stage, evolution_line = 0, 0

        new_pet = cls(
            user_data_id=user_data_id,
            evolution_line=evolution_line,
            evolution_stage=evolution_stage,
            name=name,
            level=level,
            xp=xp,
            hunger=hunger,
            happiness=happiness,
            abilities=abilities,
            created_at=created_at
        )
        db.session.add(new_pet)
        return new_pet



with app.app_context():
    db.create_all()

# ---------------------------
# Routes
# ---------------------------
@app.route('/')
def index():
    return jsonify(message="Flask API is running.")

# Registration endpoint (now returns complete user data)
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify(error="Invalid payload"), 400

    existing_user = User.query.filter_by(username=data['username']).first()
    if existing_user:
        return jsonify(error="Username already exists"), 400

    new_user = User(username=data['username'], password=data['password'])
    db.session.add(new_user)
    db.session.flush()  # Get new_user.id without committing yet

    # Create associated UserData for this new user
    new_user_data = UserData(id=new_user.id, completed_tutorial=False)
    db.session.add(new_user_data)
    db.session.commit()

    # Return full user data including UserData and nested pets
    result = new_user.to_dict()
    result["data"] = new_user.data.to_dict() if new_user.data else {}
    return jsonify(result), 201

# Login endpoint (now returns complete user data)
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify(error="Invalid payload"), 400

    user = User.query.filter_by(username=data['username']).first()
    if not user:
        return jsonify(error="User not found"), 404

    if user.password != data['password']:
        return jsonify(error="Incorrect password"), 401

    # Return full user data including UserData and nested pets
    result = user.to_dict()
    result["data"] = user.data.to_dict() if user.data else {}
    return jsonify(result), 200

# Endpoint to get a user's full data (user + userdata + nested pets)
@app.route('/userdata/<int:user_id>', methods=['GET'])
def get_userdata(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify(error="User not found"), 404
    if not user.data:
        return jsonify(error="UserData not found"), 404

    result = user.to_dict()
    result['data'] = user.data.to_dict()
    return jsonify(result), 200

@app.route('/userdata/<int:user_id>', methods=['PUT'])
def update_userdata(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify(error="User not found"), 404
    if not user.data:
        return jsonify(error="UserData not found"), 404

    data = request.get_json()
    print(f"PUT /userdata/{user_id} received data:", data)

    # Update the tutorial status if provided
    if 'completed_tutorial' in data:
        user.data.completed_tutorial = data['completed_tutorial']
        print(f"Updated completed_tutorial to: {data['completed_tutorial']}")

    # Process pets if provided using our helper function.
    if 'pets' in data:
        print(f"Processing {len(data['pets'])} pets")
        for pet_data in data['pets']:
            print(f"Processing pet data: {pet_data}")
            pet.process_json(pet_data, user.data.id)

    db.session.commit()
    updated_data = user.data.to_dict()
    return jsonify(updated_data), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

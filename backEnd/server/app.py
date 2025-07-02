from flask import Flask, jsonify, request
from flask_cors import CORS
from database import db, init_db
from models import User, UserData, Pet, HomeObject, Item, InventoryItem

app = Flask(__name__)
CORS(app)  # Enable CORS

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
init_db(app)

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
    new_user_data = UserData(id=new_user.id, completed_tutorial=False, money=0)
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

    # Update money if provided
    if 'money' in data:
        user.data.money = data['money']
        print(f"Updated money to: {data['money']}")

    # Process pets if provided using our helper function
    if 'pets' in data:
        print(f"Processing {len(data['pets'])} pets")
        for pet_data in data['pets']:
            print(f"Processing pet data: {pet_data}")
            Pet.process_json(pet_data, user.data.id)

    # Process home objects if provided
    if 'home_objects' in data:
        print(f"Processing {len(data['home_objects'])} home objects")
        for home_obj_data in data['home_objects']:
            print(f"Processing home object data: {home_obj_data}")
            HomeObject.process_json(home_obj_data, user.data.id)

    # Process inventory if provided
    if 'inventory' in data:
        print(f"Processing {len(data['inventory'])} inventory items")
        for inv_data in data['inventory']:
            print(f"Processing inventory data: {inv_data}")
            InventoryItem.process_json(inv_data, user.data.id)

    db.session.commit()
    
    # Return complete user data like login/register endpoints do
    result = user.to_dict()
    result["data"] = user.data.to_dict()
    
    # Transform to match frontend expectations  
    response_data = {
        "id": result["id"],
        "username": result["username"], 
        "completed_tutorial": result["data"]["completed_tutorial"],
        "money": result["data"]["money"],
        "pets": result["data"]["pets"],
        "home_objects": result["data"]["home_objects"],
        "inventory": result["data"]["inventory"]
    }
    
    return jsonify(response_data), 200

# Delete a specific home object
@app.route('/homeobject/<int:home_object_id>', methods=['DELETE'])
def delete_home_object(home_object_id):
    """Delete a specific home object by ID."""
    home_obj = db.session.get(HomeObject, home_object_id)
    if not home_obj:
        return jsonify(error="Home object not found"), 404
    
    print(f"🗑️ Deleting home object {home_object_id} (type: {home_obj.type}, object_id: {home_obj.object_id})")
    
    # Store user_data_id before deletion for response
    user_data_id = home_obj.user_data_id
    
    # Delete the object
    db.session.delete(home_obj)
    db.session.commit()
    
    return jsonify({
        "message": "Home object deleted successfully",
        "deleted_id": home_object_id,
        "user_data_id": user_data_id
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

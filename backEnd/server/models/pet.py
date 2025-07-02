from database import db

class Pet(db.Model):
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
    last_update = db.Column(db.BigInteger, nullable=True) # timestamp in milliseconds for degradation tracking

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
            "createdAt": self.created_at,
            "lastUpdate": self.last_update
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
                pet.last_update = pet_data.get("lastUpdate", pet.last_update)
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
        last_update = pet_data.get("lastUpdate")
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
            created_at=created_at,
            last_update=last_update
        )
        db.session.add(new_pet)
        return new_pet

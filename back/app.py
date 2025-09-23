from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
CORS(app)

jwt_secret = os.getenv('JWT_SECRET_KEY')
if not jwt_secret:
    raise RuntimeError("JWT_SECRET_KEY não encontrada no arquivo .env")

app.config['JWT_SECRET_KEY'] = jwt_secret
jwt = JWTManager(app)

hashed_password = generate_password_hash("senha123", method="pbkdf2:sha256",)

users_db = {
    "usuario1": {
        "password": hashed_password
    }
}

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = users_db.get(username, None)

    if not user or not check_password_hash(user['password'], password):
        return jsonify({"msg": "Usuário ou senha inválidos"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200

@app.route("/api/profile", methods=["GET"])
@jwt_required()
def protected_profile():
    current_user = get_jwt_identity()
    return jsonify(loggedInAs=current_user, message=f"Seja bem-vindo, {current_user}"), 200

if __name__ == '__main__':
    app.run(debug=True)

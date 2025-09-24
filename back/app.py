from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os
from typing import Any

load_dotenv()
app = Flask(__name__)
CORS(app)

jwt_secret = os.getenv('JWT_SECRET_KEY')
if not jwt_secret:
    raise RuntimeError("JWT_SECRET_KEY não encontrada no arquivo .env")

app.config['JWT_SECRET_KEY'] = jwt_secret
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 30 # segundos
jwt = JWTManager(app)

hashed_password = generate_password_hash("senha123", method="pbkdf2:sha256",)

services: list[dict[str, Any]] = [
    {"id": 1, "name": "Serviço A", "description": "Descrição do Serviço A"},
    {"id": 2, "name": "Serviço B", "description": "Descrição do Serviço B"},
    {"id": 3, "name": "Serviço C", "description": "Descrição do Serviço C"},
]
users_db = {
    "JuanSoares": {
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

@app.route("/api/services", methods=["GET"])
@jwt_required()
def protected_services():
    if not services:
        return jsonify({"msg": "Nenhum serviço cadastrado"}), 404
    return jsonify(services), 200

@app.route("/api/services", methods=["POST"])
@jwt_required()
def add_service():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')

    if not name or not description:
        return jsonify({"msg": "Nome e descrição são obrigatórios"}), 400

    new_service = {
        "id": len(services) + 1,
        "name": name,
        "description": description
    }
    services.append(new_service)
    return jsonify(new_service), 201

@app.route("/api/services", methods=["DELETE"])
@jwt_required()
def delete_service():
    data = request.get_json()
    service_id = data.get("id")

    service = next((s for s in services if s["id"] == service_id), None)
    if not service:
        return jsonify({"msg": "Serviço não encontrado"}), 404

    services.remove(service)
    return jsonify({"msg": "Serviço removido com sucesso"}), 200

@app.route("/api/services", methods=["PUT"])
@jwt_required()
def update_service():
    data = request.get_json()
    service_id = data.get("id")
    name = data.get("name")
    description = data.get("description")

    service = next((s for s in services if s["id"] == service_id), None)
    if not service:
        return jsonify({"msg": "Serviço não encontrado"}), 404

    if name:
        service["name"] = name
    if description:
        service["description"] = description

    return jsonify(service), 200

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os
from typing import Any
from functools import wraps

load_dotenv()
app = Flask(__name__)
CORS(app)

jwt_secret = os.getenv('JWT_SECRET_KEY')
if not jwt_secret:
    raise RuntimeError("JWT_SECRET_KEY não encontrada no arquivo .env")

app.config['JWT_SECRET_KEY'] = jwt_secret
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 20 # segundos
jwt = JWTManager(app)

hashed_password_juan = generate_password_hash("senha123", method="pbkdf2:sha256")
hashed_password_visitante = generate_password_hash("outrasenha", method="pbkdf2:sha256")

# Lista de serviços em memória
services: list[dict[str, Any]] = [
    {"id": 1, "name": "Serviço A", "description": "Descrição do Serviço A"},
    {"id": 2, "name": "Serviço B", "description": "Descrição do Serviço B"},
]

# Base de usuários com senhas e roles
users_db = {
    "JuanSoares": {
        "password": hashed_password_juan,
        "role": "admin"
    },
    "Visitante": {
        "password": hashed_password_visitante,
        "role": "guest"
    }
}

def role_required(role: str):
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            claims = get_jwt()
            if claims.get("role") != role:
                return jsonify(msg=f"Acesso restrito a {role}!"), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = users_db.get(username)

    if not user or not check_password_hash(user['password'], password):
        return jsonify({"msg": "Usuário ou senha inválidos"}), 401

    additional_claims = {"role": user["role"]}
    access_token = create_access_token(identity=username, additional_claims=additional_claims)
    return jsonify(access_token=access_token), 200

@app.route("/api/profile", methods=["GET"])
@jwt_required()
def protected_profile():
    current_user = get_jwt_identity()
    claims = get_jwt()
    role = claims.get("role", "unknown")
    return jsonify(loggedInAs=current_user, role=role, message=f"Seja bem-vindo, {current_user}"), 200

@app.route("/api/services", methods=["GET"])
@role_required("admin")
def get_services():
    return jsonify(services), 200

@app.route("/api/services", methods=["POST"])
@role_required("admin")
def add_service():
    data = request.get_json()
    new_service = {
        "id": len(services) + 1 if services else 1,
        "name": data.get('name'),
        "description": data.get('description')
    }
    services.append(new_service)
    return jsonify(new_service), 201

@app.route("/api/services", methods=["DELETE"])
@role_required("admin")
def delete_service():
    service_id = request.get_json().get("id")
    service_to_delete = next((s for s in services if s["id"] == service_id), None)
    if service_to_delete:
        services.remove(service_to_delete)
        return jsonify({"msg": "Serviço removido com sucesso"}), 200
    return jsonify({"msg": "Serviço não encontrado"}), 404

@app.route("/api/services", methods=["PUT"])
@role_required("admin")
def update_service():
    data = request.get_json()
    service_id = data.get("id")
    service_to_update = next((s for s in services if s["id"] == service_id), None)
    if service_to_update:
        service_to_update["name"] = data.get("name", service_to_update["name"])
        service_to_update["description"] = data.get("description", service_to_update["description"])
        return jsonify(service_to_update), 200
    return jsonify({"msg": "Serviço não encontrado"}), 404

if __name__ == '__main__':
    app.run(debug=True)
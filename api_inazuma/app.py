from flask import Flask, jsonify, send_from_directory, request
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from flask_cors import CORS
from datetime import datetime, timedelta
import jwt
import re
import random

# ----------------- APP -----------------
app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TECNICAS_FOLDER = os.path.join(os.getcwd(), 'tecnicas')
IMAGENES_FOLDER = os.path.join(BASE_DIR, "img") 
BASE_API_URL = "http://127.0.0.1:5000"
SECRET_KEY = "rockruff"  # Cambiar por algo seguro

# ----------------- MONGO -----------------
client = MongoClient("mongodb://localhost:27017/")
db = client["Lisensiado"]
tecnicas = db["tecnicas"]
equipos = db["equipos"]
jugadores = db["jugadores"]
usuarios = db["usuarios"]

# ----------------- RUTA DE IMÁGENES -----------------
@app.route("/img/<path:filename>")
def serve_image(filename):
    """
    Esta ruta es dinámica gracias a <path:filename>. 
    Si pides /img/jugadoresID/Byron_Love.png, buscará en img/jugadoresID/Byron_Love.png
    """
    file_path = os.path.join(IMAGENES_FOLDER, filename)
    
    print(f"--- Solicitud de Imagen ---")
    print(f"Buscando en disco: {file_path}")
    
    if not os.path.exists(file_path):
        print("❌ Archivo no encontrado")
        return jsonify({"error": f"Imagen no encontrada: {filename}"}), 404

    print("✅ Archivo encontrado")
    # Es importante pasar la subcarpeta si el filename la incluye
    directory = os.path.dirname(file_path)
    name = os.path.basename(file_path)
    return send_from_directory(directory, name)

# ---------------- RUTA TECNICAS -----------------
@app.route('/tecnicas/<path:filename>')
def serve_video_tecnica(filename):
    # APUNTAMOS A LA RUTA REAL: api_inazuma/img/tecnicas
    base_dir = os.path.dirname(os.path.abspath(__file__))
    tecnicas_path = os.path.join(base_dir, 'img', 'tecnicas') # <--- Añadimos 'img' aquí
    
    file_path = os.path.join(tecnicas_path, filename)
    
    print(f"--- DEBUG DE RUTA ---")
    print(f"Buscando en: {file_path}")
    
    if not os.path.exists(file_path):
        return jsonify({"error": "No encontrado", "ruta_revisada": file_path}), 404

    return send_from_directory(tecnicas_path, filename)

# ----------------- REGISTRO -----------------
@app.route('/registrar', methods=['POST'])
def registrar_usuario():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not username or not email or not password or not confirm_password:
        return jsonify({"message": "⚠️ Todos los campos son obligatorios"}), 400

    email_pattern = r'^[\w\.-]+@[\w\.-]+\.(com|es)$'
    if not re.match(email_pattern, email):
        return jsonify({"message": "⚠️ El correo debe ser válido y terminar en .com o .es"}), 400

    if password != confirm_password:
        return jsonify({"message": "⚠️ Las contraseñas no coinciden"}), 400

    if usuarios.find_one({"email": email}):
        return jsonify({"message": "⚠️ El correo ya está en uso"}), 400

    nuevo_usuario = {
        "username": username,
        "email": email,
        "password": password,  # ⚠️ En producción: usar hash
        "favoritos": [],
        "equipo": [],
        "createdAt": datetime.utcnow()
    }

    usuarios.insert_one(nuevo_usuario)
    return jsonify({"message": "✅ Registro exitoso"}), 201

# ----------------- LOGIN -----------------
@app.route('/iniciar_sesion', methods=['POST'])
def iniciar_sesion():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "⚠️ Se requiere nombre de usuario y contraseña"}), 400

    usuario = usuarios.find_one({"username": username})
    if usuario and usuario['password'] == password:
        payload = {
            "sub": str(usuario["_id"]),
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        if isinstance(token, bytes):
            token = token.decode('utf-8')

        usuario_info = {
            "id": str(usuario["_id"]),
            "username": usuario["username"],
            "email": usuario["email"],
            "favoritos": usuario.get("favoritos", []),
            "equipo": usuario.get("equipo", [])
        }

        return jsonify({
            "message": f"✅ Bienvenido, {usuario['username']}!", 
            "token": token, 
            "usuario": usuario_info
        }), 200
    else:
        return jsonify({"message": "⚠️ Usuario o contraseña incorrectos"}), 401

# ----------------- JUGADORES -----------------
@app.route("/jugadores", methods=["GET"])
def obtener_jugadores():
    resultado = []

    for j in jugadores.find():
        genero = "Masculino" if j.get("sex") == "M" else "Femenino"

        # Obtener la URL de la imagen y asegurarse de que sea completa
        imagen_url = ""
        image_field = j.get("image")
        if image_field and isinstance(image_field, dict):
            imagen_url = image_field.get("url", "")
            if imagen_url.startswith("/"):
                imagen_url = f"{BASE_API_URL}{imagen_url}"

        resultado.append({
            "id": str(j["_id"]),
            "name": j.get("name", ""),
            "japaneseName": j.get("japaneseName", ""),
            "element": j.get("element", ""),
            "position": j.get("position", ""),
            "gender": genero,
            "nature": j.get("nature", ""),
            "role": j.get("role", ""),
            "season": j.get("season", "IE3"),
            "power": j.get("stats", {}).get("kicking", 0),
            "image": imagen_url
        })

    return jsonify(resultado)

# ----------------- JUGADORES INFO -----------------
@app.route("/jugadores/<id>", methods=["GET"])
def detalle_jugador(id):
    try:
        jugador = jugadores.find_one({"_id": id})
        if not jugador:
            return jsonify({"error": f"Jugador {id} no encontrado"}), 404

        base_url = globals().get('BASE_API_URL', 'http://127.0.0.1:5000')

        # --- LÓGICA DE IMAGEN ---
        if "imageDetail" in jugador:
            path_imagen = jugador["imageDetail"].get("url", "")
        else:
            path_imagen = f"/img/jugadoresID/{id.lower()}.png"

        imagen_url = f"{base_url}{path_imagen}" if path_imagen.startswith("/") else f"{base_url}/{path_imagen}"
            
        character = {
            "id": str(jugador["_id"]),
            "name": jugador.get("name"),
            "japaneseName": jugador.get("japaneseName", ""),
            "element": jugador.get("element"),
            "position": jugador.get("position"),
            "gender": "Masculino" if jugador.get("sex") == "M" else "Femenino",
            "nature": jugador.get("nature"),
            "role": jugador.get("role"),
            "season": jugador.get("season", "IE1"),
            "description": jugador.get("description", ""),
            "image": imagen_url,
            "stats": jugador.get("stats", {}),
            "matchStats": jugador.get("matchStats", { "stamina": 0, "tension": 0 }), # [2026-02-25]
            "power": jugador.get("stats", {}).get("kicking", 0),
            "teams": jugador.get("teams", []),
            "country": jugador.get("country", "")
        }

        # --- TÉCNICAS (CON VIDEO Y COSTES) ---
        tech_data = []
        for t in jugador.get("techniques", []):
            t_id = t.get("technique_id")
            relacion = t.get("relation", "normal").lower()
            info_tech = tecnicas.find_one({"_id": t_id})
            
            if info_tech:
                # Modificadores de poder recordados
                mod = 1.0
                if relacion == "heredero": mod = 0.5 # [2026-02-27]
                elif relacion == "copia": mod = 0.3 # [2026-02-11]
                
                # Procesar URL del video
                video_raw = info_tech.get("videoUrl", {}).get("url", "")
                video_url = f"{base_url}{video_raw}" if video_raw else None

                base_pwr = info_tech.get("basePower", 0)
                
                tech_data.append({
                    "id": t_id,
                    "name": info_tech.get("name"),
                    "type": info_tech.get("type"),
                    "element": info_tech.get("element"),
                    "relation": relacion,
                    "finalPower": int(base_pwr * mod),
                    "videoUrl": video_url, # <--- IMPORTANTE PARA EL FRONTEND
                    "cost": info_tech.get("cost", {"stamina": 0, "tension": 0}) # <--- PARA LOS CUADROS PE/PT
                })

        return jsonify({
            "character": character,
            "techniques": tech_data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

#------------------ TECNICAS -------------------
@app.route('/tecnicas', methods=['GET'])
def get_all_techniques():
    try:
        # Buscamos todas las técnicas
        tecnicas_db = list(db.tecnicas.find())
        base_url = "http://127.0.0.1:5000"

        for tech in tecnicas_db:
            tech['_id'] = str(tech['_id'])
            
            # Aseguramos que matchStats exista (instrucción de memoria)
            if 'matchStats' not in tech:
                tech['matchStats'] = {}

            # Construimos la URL del video de forma segura
            # Si 'videoUrl' es un diccionario con la subclave 'url'
            if isinstance(tech.get('videoUrl'), dict) and tech['videoUrl'].get('url'):
                video_path = tech['videoUrl']['url']
                tech['videoUrl'] = f"{base_url}{video_path}"
            
            # Normalizamos el tipo para el frontend (Shot -> Tiro, etc.) si es necesario
            # O simplemente lo pasamos a minúsculas para que el filtro no falle
            if 'type' in tech:
                tech['type'] = tech['type'].lower()

        return jsonify(tecnicas_db), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#---------------- EQUIPOS --------------------------
@app.route('/equipos', methods=['GET'])
def get_all_teams():
    try:
        equipos_db = list(db.equipos.find())
        base_url = "http://127.0.0.1:5000"
        
        for team in equipos_db:
            team['_id'] = str(team['_id'])
            # Construir URL de la imagen del equipo
            if 'image' in team and team['image'].get('url'):
                team['image']['url'] = f"{base_url}{team['image']['url']}"
        
        return jsonify(equipos_db), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
#---------------------LLAMADA JUGADORES EQUIPOS--------------
@app.route('/equipos/<team_id>', methods=['GET'])
def get_team_by_id(team_id):
    try:
        team = db.equipos.find_one({"_id": team_id})
        if not team:
            return jsonify({"error": "Equipo no encontrado"}), 404
        
        # IMPORTANTE: En producción, base_url debería ser la URL de tu backend real
        # Si usas rutas relativas en el frontend, a veces es mejor enviar solo el path
        base_url = "http://127.0.0.1:5000" 
        
        team['_id'] = str(team['_id'])
        
        # 1. Imagen del equipo
        if 'image' in team and team['image'].get('url'):
            if not team['image']['url'].startswith('http'):
                team['image']['url'] = f"{base_url}{team['image']['url']}"

        # 2. BUSCAR JUGADORES Y FILTRAR SOLO LO QUE PIDES
        player_ids = team.get('player_ids', [])
        players_db = list(db.jugadores.find({"_id": {"$in": player_ids}}))
        
        processed_players = []
        for p in players_db:
            # Solo extraemos lo que necesitas: nombre, dorsal, elemento e imagen
            player_data = {
                "name": p.get("name"),
                "number": p.get("number"),
                "element": p.get("element"),
                "matchStats": p.get("matchStats", {}) # Mantengo esto por tus instrucciones previas
            }
            
            # Procesar imagen del jugador
            if 'image' in p and p['image'].get('url'):
                url = p['image']['url']
                player_data["image_url"] = f"{base_url}{url}" if not url.startswith('http') else url
            else:
                player_data["image_url"] = None

            processed_players.append(player_data)

        team['players'] = processed_players 
        return jsonify(team), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500      

# ----------------- RUN -----------------
if __name__ == "__main__":
    app.run(debug=True)
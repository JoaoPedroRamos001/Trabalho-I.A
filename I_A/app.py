from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # Permite requisições de origens diferentes

GOOGLE_GEMINI_API_KEY = "AIzaSyCMcAh6-zCqit1HsXTfEoE2EgFUaEJJ7-U"
genai.configure(api_key=GOOGLE_GEMINI_API_KEY)
chat = genai.GenerativeModel("gemini-1.5-flash").start_chat(history=[])

@app.route('/chat', methods=['POST'])
def chat_with_bot():
    data = request.json
    user_message = data.get("message", "")
    if not user_message:
        return jsonify({"error": "Mensagem vazia"}), 400
    
    response = chat.send_message(user_message)
    return jsonify({"reply": response.text})

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, render_template, request, Response
import ollama

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()
    message = data["message"]

    def generate():

        stream = ollama.chat(
            model="llama3.2:latest",
            messages=[
                {
                    "role": "system",
                    "content": "Your name is Eco 1. You are a helpful assistant."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            stream=True
        )

        for chunk in stream:
            text = chunk["message"]["content"]
            yield text

    return Response(generate(), mimetype="text/plain")


if __name__ == "__main__":
    app.run(debug=True)
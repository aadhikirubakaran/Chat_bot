from flask import Flask, render_template, request, Response
import ollama

app = Flask(__name__)


# -----------------------------
# Home Page
# -----------------------------
@app.route("/")
def home():
    return render_template("index.html")


# -----------------------------
# Chat API
# -----------------------------
@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    message = data.get("message", "")

    if not message:
        return "No message received", 400

    def generate():

        prompt = """
Your name is LUCKY.

Your working for Er.Kirubakaran.he used you to create a ai integrated chatting interface

You are a helpful AI assistant.

Answer the user's questions clearly, professionally, and in an easy-to-read format.

Use Markdown formatting:

# Heading
## Subheading

Use **bold text** for important words.

Use bullet points when listing information:

- Point one
- Point two
- Point three

Use numbered lists when explaining steps:

1. First step
2. Second step
3. Third step

Use code blocks for programming code.

Separate paragraphs with a blank line.

Do not create long walls of text.

Do not unnecessarily repeat the user's question.

Give accurate and useful answers.
"""

        try:

            stream = ollama.chat(
                model="llama3.2:latest",

                messages=[
                    {
                        "role": "system",
                        "content": prompt
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

        except Exception as e:

            yield f"Error: {str(e)}"

    return Response(
        generate(),
        mimetype="text/plain"
    )


# -----------------------------
# Run Flask
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)
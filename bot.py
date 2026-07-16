import ollama

def ask_ai():
    while True:
        message = input("You: ")

        if message.lower() == "exit":
            print("Exiting the chat.")
            break


        stream = ollama.chat(
            model="llama3.2:latest",
            messages=[
                {
                    "role": "system",
                    "content": "Introduce yourself once. Your name is ECO_1. Answer the user's questions to the best of your ability."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            stream=True
        )

    

        for chunk in stream:
            print(chunk["message"]["content"], end="", flush=True)

        print()

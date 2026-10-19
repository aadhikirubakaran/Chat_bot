// ==========================================
// SEND MESSAGE
// ==========================================

async function sendMessage() {

    let input = document.getElementById("message");
    let message = input.value.trim();

    if (message === "") {
        return;
    }

    let chatbox = document.getElementById("chatbox");


    // ==========================================
    // SHOW USER MESSAGE
    // ==========================================

    let userMessage = document.createElement("div");

    userMessage.className = "user-message";

    userMessage.innerHTML = `
        <div class="message"></div>

        <div class="avatar">
            🧑
        </div>
    `;

    // Safely display user's message
    userMessage.querySelector(".message").textContent = message;

    chatbox.appendChild(userMessage);

    input.value = "";


    // ==========================================
    // CREATE AI MESSAGE
    // ==========================================

    let botMessage = document.createElement("div");

    botMessage.className = "bot-message";

    botMessage.innerHTML = `
        <div class="avatar">
            🤖
        </div>

        <div class="message">
            <span class="typing">
                Thinking...
            </span>
        </div>
    `;

    chatbox.appendChild(botMessage);

    let aiMessage = botMessage.querySelector(".message");


    // ==========================================
    // CHECK IF USER IS AT BOTTOM
    // ==========================================

    function isNearBottom() {

        return (
            chatbox.scrollHeight -
            chatbox.scrollTop -
            chatbox.clientHeight
        ) < 100;

    }


    // Initially scroll to bottom
    chatbox.scrollTop = chatbox.scrollHeight;


    // ==========================================
    // SEND REQUEST TO FLASK
    // ==========================================

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });


        if (!response.ok) {

            throw new Error(
                "Server returned an error"
            );

        }


        // ==========================================
        // STREAM READER
        // ==========================================

        const reader =
            response.body.getReader();

        const decoder =
            new TextDecoder();


        let fullResponse = "";


        // Remove Thinking...
        aiMessage.innerHTML = "";


        // ==========================================
        // RECEIVE OLLAMA RESPONSE
        // ==========================================

        while (true) {

            const {
                value,
                done
            } = await reader.read();


            if (done) {
                break;
            }


            // Convert chunk to text
            const chunk =
                decoder.decode(
                    value,
                    {
                        stream: true
                    }
                );


            // Add chunk
            fullResponse += chunk;


            // ==========================================
            // MARKDOWN → HTML
            // ==========================================

            aiMessage.innerHTML =
                marked.parse(fullResponse);


            // ==========================================
            // AUTO SCROLL ONLY IF AT BOTTOM
            // ==========================================

            if (isNearBottom()) {

                chatbox.scrollTop =
                    chatbox.scrollHeight;

            }

        }


        // Final Markdown rendering
        aiMessage.innerHTML =
            marked.parse(fullResponse);


        // Remove temporary ID if used
        aiMessage.removeAttribute("id");


    }
    catch (error) {

        console.error(error);

        aiMessage.innerHTML = `
            <p>
                ❌ <strong>Error:</strong>
                ${error.message}
            </p>
        `;

    }

}



// ==========================================
// ENTER KEY
// ==========================================

document
    .getElementById("message")
    .addEventListener(
        "keypress",
        function(event) {

            if (event.key === "Enter") {

                sendMessage();

            }

        }
    );



// ==========================================
// NEW CHAT
// ==========================================

function newChat() {

    let chatbox =
        document.getElementById("chatbox");

    chatbox.innerHTML = `

        <div class="bot-message">

            <div class="avatar">
                🤖
            </div>

            <div class="message">

                <h3>Hello! 👋</h3>

                <p>
                    I'm <b>Eco 1</b>.
                </p>

                <p>
                    New conversation started.
                </p>

            </div>

        </div>

    `;

}
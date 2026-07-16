async function sendMessage() {

    let input = document.getElementById("message");
    let message = input.value.trim();

    if (message === "") return;

    let chatbox = document.getElementById("chatbox");

    // Show user message
    chatbox.innerHTML += `
        <div class="user-message">
            <div class="message">${message}</div>
            <div class="avatar">🧑</div>
        </div>
    `;

    input.value = "";

    // Create an empty AI message
    chatbox.innerHTML += `
        <div class="bot-message">
            <div class="avatar">🤖</div>
            <div class="message" id="current-ai"></div>
        </div>
    `;

    chatbox.scrollTop = chatbox.scrollHeight;

    const response = await fetch("/chat", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            message: message
        })

    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let aiMessage = document.getElementById("current-ai");

    while (true) {

        const { value, done } = await reader.read();

        if (done) break;

        aiMessage.innerHTML += decoder.decode(value);

        chatbox.scrollTop = chatbox.scrollHeight;
    }

    aiMessage.removeAttribute("id");
}
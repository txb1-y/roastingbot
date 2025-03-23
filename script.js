const API_KEY = "AIzaSyAi4ZmiAAcr7HgwvINOrS7N9p6QyhWKlF4";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

let chatHistory = []; // Stores past messages for context

async function getRoast() {
    let userText = document.getElementById("userInput").value;
    let chatbox = document.getElementById("chatbox");

    if (userText.trim() === "") {
        alert("Type something first to get roasted! 😈");
        return;
    }

    // Add user message to chat
    addMessage("user", userText);

    document.getElementById("userInput").value = ""; // Clear input

    // Push user message to history
    chatHistory.push({ role: "user", text: userText });

    const payload = {
        contents: [{
            parts: [{
                text: `You are a savage, sarcastic, and humorous Thanglish roaster. 
                      Roast the user BRUTALLY based on: "${userText}"  
                      and reference previous conversations for continuity: ${JSON.stringify(chatHistory)}  
                      **Make it extremely witty, short, and hurtful.**  
                      **Use strong Thanglish slang, savage humor, and emojis.**  
                      **Make it feel like a natural roast, not robotic.**`
            }]
        }]
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "API issue!");

        let roastText = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI didn't respond.";

        // Push bot reply to history
        chatHistory.push({ role: "bot", text: roastText });

        // Add bot reply to chat
        addMessage("bot", roastText);

    } catch (error) {
        addMessage("bot", `Error: ${error.message}`);
        console.error("API Error:", error);
    }
}

// Function to add messages dynamically
function addMessage(role, text) {
    let chatbox = document.getElementById("chatbox");

    if (role === "user") {
        chatbox.innerHTML += `
            <div class="message user-msg">
                <strong>🙋‍♂️ You</strong> ${text}
            </div>
        `;
    } else {
        chatbox.innerHTML += `
            <div class="message bot-msg">
                <div class="bot-header">
                    <strong>🤖 RoastBot</strong>
                </div>
                <div>${text}</div>
            </div>
        `;
    }

    chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to latest message
}

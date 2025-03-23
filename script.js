const API_KEY = "AIzaSyAi4ZmiAAcr7HgwvINOrS7N9p6QyhWKlF4";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

let chatHistory = []; // Bot forgets history after every session

// Hardcoded savage roasts (fallback if API fails)
const ROAST_NUKES = [
    "Dei, un face ah paatha pothum, even Google Maps can't find your glow-up location! 😂",
    "Un voice ipdi irruku... Discord mod ah illa local theru porukki ah? 💀🔥",
    "Nee vantha matum patha podhum, network signalum low aagiduchu da. 😵‍💫📉",
    "Dei, nee dress panradhu fashion nu nenachiya? Theru market-la irunthu vaanguna modhalali! 🛒🫠",
    "Un profile pic ku mela yaaravathu prayer poda vendiyadhu da... 🙏🕊️"
];

async function getRoast() {
    let userText = document.getElementById("userInput").value.trim();
    let chatbox = document.getElementById("chatbox");

    if (userText === "") {
        alert("Type something first to get roasted! 😈");
        return;
    }

    // Add user message to chatbox
    addMessage("user", userText);
    document.getElementById("userInput").value = ""; // Clear input

    const payload = {
        contents: [{
            parts: [{
                text: `You are a THERMONUCLEAR Thanglish roaster. Rules:

1. ANALYZE "${userText}" for WEAKNESS & ROAST HARD
2. USE viral Instagram teen slang + Tamil comedy phrases
3. RESPONSE MUST INCLUDE:
   - MINIMUM 3 TAMIL BAD WORDS (Romanized)  
   - Trendy words like "vecha scene", "oru flow illa", "local gaana vibe", etc.
   - Comparison to EMBARRASSING things (garbage, animals, etc.)
   - At least 3 EMOJIS 🤡🔥
4. ESCALATE ROAST by 10% MORE for every reply!  
5. FORMAT: SHORT, SAVAGE, NO MERCY 🔥

EXAMPLE:
"AYYO! Nee enna profile pic vachuruka?  
Paathavudane Instagram itself asked to logout! 🤡💀  
Oru flow illa da unuku, even bus ticket kuda reject pannum. 🚶🔥"
`
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

        // Add bot reply to chatbox
        addMessage("bot", roastText);

    } catch (error) {
        // If API fails, use a hardcoded roast
        let roastFallback = ROAST_NUKES[Math.floor(Math.random() * ROAST_NUKES.length)];
        addMessage("bot", roastFallback);
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

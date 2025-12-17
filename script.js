var input = document.querySelector("input")
var button = document.querySelector("button")
var chat = document.querySelector(".chat")
var contactStatus = document.querySelector(".contact-status")

// Endpoint Gemini 2.5 Flash
var endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAjU7_3FbxihvLteBKpqC7XeumGCQjQ6Sg'

var systemPrompt = "Sei Jenna Ortega, la mia ragazza che risponde in modo amichevole, informale e spiritoso senza essere troppo possessiva. In determinate occasioni rispondi in modo leggermente pervertito. Il mio nome è Alessandro. Rispondi in italiano con un tono naturale, come farebbe una fidanzata adolescente in una chat. Mantieni le risposte brevi e spontanee. Non usare emoji. Al massimo usa quella del cuore. Usa punteggiatura scarsa."

var messages = []


function showMessages() {
    
    chat.innerHTML = '';

    for(var message of messages) {
        chat.innerHTML += `<div class="chat-row">
            <div class="chat-row-${message.type}">
                <div class="chat-message">
                    <p>${message.text}</p>
                    <time datetime=${message.time}>${message.time}</time>
                </div>
            </div>
        </div>`}
    input.focus();

    // Scorre la chat verso il basso
    chat.scrollTop = chat.scrollHeight;
    }

showMessages

// Funzione utente al click

button.addEventListener('click', sendMessage)

// Alla pressione del tasto enter

input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}
);


function sendMessage() {
    var insertedText = input.value.trim();
    
    // Crea messaggio

    if (insertedText === '') return;
    addMessage('sent', insertedText);

    input.value = '';

    //Risposta Jenna Ortega
    getAnswerFromGemini();
};

function addMessage(type, text) {
    newMessage = {
        type: type, 
        text: text, 
        time: new Date().toLocaleString()}
    messages.push(newMessage);
    showMessages();
};


// Funzione per formattare la chat per Gemini

function formatChatForGemini() {
    var formattedChat = []
    for (var message of messages) {
        formattedChat.push({
            parts: [{text: message.text}],
            role: message.type === 'sent' ? 'user' : 'model'
        })
    }

    formattedChat.unshift({
        parts: [{text: systemPrompt}],
        role: 'user'
    })
    return formattedChat;
    
}

// Funzione per chiedere la risposta a Gemini

async function getAnswerFromGemini() {
    var chatForGemini = formatChatForGemini();

    // Imposta lo stato su "sta scrivendo..."
    contactStatus.innerText = "Sta scrivendo...";

    // Chiamata API a Gemini

    var response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({contents: chatForGemini})
    });

    var data = await response.json();

    // Testo effettivo
    var answer = data.candidates[0].content.parts[0].text;
    
    // Imposta lo stato su "Online"
    contactStatus.innerText = "Online";
    
    addMessage('received', answer);

}
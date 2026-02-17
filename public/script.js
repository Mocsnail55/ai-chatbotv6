document.getElementById("sendBtn").addEventListener("click", async () => {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    addMessage("bot", data.reply);
  } catch (err) {
    addMessage("bot", "Error contacting server.");
    console.error(err);
  }
});

function addMessage(sender, text) {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = sender;
  div.textContent = text;
  chat.appendChild(div);
}
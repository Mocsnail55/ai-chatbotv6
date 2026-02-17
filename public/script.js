document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const personalitySelect = document.getElementById("personality");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = input.value.trim();
    const personality = personalitySelect.value;

    if (!message) return;

    addMessage("You", message);
    input.value = "";

    try {

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, personality })
      });

      if (!response.ok) {
        addMessage("Bot", "Server error — try again");
        return;
      }

      const data = await response.json();

      addMessage("Bot", data.reply || "No response from model");
    } catch (err) {
      console.error("CLIENT ERROR:", err);
      addMessage("Bot", "Error: could not reach server");
    }
  });

  function addMessage(sender, text) {
    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});


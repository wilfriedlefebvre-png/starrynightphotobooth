(function () {
  if (document.getElementById("sn-chatbot-root")) return;

  var root = document.createElement("div");
  root.id = "sn-chatbot-root";
  root.innerHTML =
    '<div id="sn-chat-panel" hidden>' +
    '  <div class="sn-chat-header">' +
    "    <span>Starry Night Assistant</span>" +
    '    <button class="sn-chat-close" type="button" aria-label="Close chat">✕</button>' +
    "  </div>" +
    '  <div class="sn-chat-messages" id="sn-chat-messages"></div>' +
    '  <div class="sn-chat-quick" id="sn-chat-quick">' +
    '    <button class="sn-quick-btn" type="button">Pricing</button>' +
    '    <button class="sn-quick-btn" type="button">Check availability</button>' +
    '    <button class="sn-quick-btn" type="button">Wedding packages</button>' +
    '    <button class="sn-quick-btn" type="button">Corporate events</button>' +
    '    <button class="sn-quick-btn" type="button">Call now</button>' +
    "  </div>" +
    '  <form class="sn-chat-form" id="sn-chat-form">' +
    '    <input class="sn-chat-input" id="sn-chat-input" type="text" placeholder="Ask about pricing, packages, or booking..." autocomplete="off" />' +
    '    <button class="sn-chat-send" type="submit">Send</button>' +
    "  </form>" +
    "</div>" +
    '<button id="sn-chat-toggle" type="button" aria-label="Open chat">💬</button>';

  document.body.appendChild(root);

  var panel = document.getElementById("sn-chat-panel");
  var toggle = document.getElementById("sn-chat-toggle");
  var closeBtn = root.querySelector(".sn-chat-close");
  var form = document.getElementById("sn-chat-form");
  var input = document.getElementById("sn-chat-input");
  var messages = document.getElementById("sn-chat-messages");
  var quick = document.getElementById("sn-chat-quick");
  var pendingReply = false;

  function addMessage(text, who) {
    var row = document.createElement("div");
    row.className = "sn-chat-row " + who;
    var bubble = document.createElement("div");
    bubble.className = "sn-chat-bubble";
    bubble.textContent = text;
    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  function addTyping() {
    var row = document.createElement("div");
    row.className = "sn-chat-row bot";
    row.id = "sn-chat-typing";
    var bubble = document.createElement("div");
    bubble.className = "sn-chat-bubble sn-chat-typing";
    bubble.textContent = "Typing...";
    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    var typing = document.getElementById("sn-chat-typing");
    if (typing) typing.remove();
  }

  function botReply(text) {
    var t = text.toLowerCase();
    if (t.includes("price") || t.includes("cost") || t.includes("quote")) {
      return "Pricing depends on event type, hours, and package. You can get a fast quote on the Contact page: /contact/.";
    }
    if (t.includes("book") || t.includes("availability") || t.includes("date")) {
      return "Great! To check availability, use the booking form on /contact/ and we will follow up quickly.";
    }
    if (t.includes("wedding")) {
      return "Our Wedding options are on /weddings/ with Glam, Classic, Signature, Luxury, and 360 experiences.";
    }
    if (t.includes("company") || t.includes("corporate")) {
      return "For corporate events, visit /company-events/. We offer branded overlays, digital sharing, and 360 content.";
    }
    if (t.includes("private") || t.includes("party") || t.includes("birthday")) {
      return "Private party details are at /private-parties/. It is perfect for birthdays, graduations, and milestone events.";
    }
    if (t.includes("gallery") || t.includes("photos")) {
      return "You can view real event photos here: /gallery/.";
    }
    if (t.includes("phone") || t.includes("call")) {
      return "You can call Starry Night Photo Booths at (949) 342-4797.";
    }
    return "I can help with packages, pricing, and booking. Try asking: 'What package is best for weddings?' or 'How do I check availability?'";
  }

  function openChat() {
    panel.hidden = false;
    toggle.hidden = true;
    input.focus();
  }

  function closeChat() {
    panel.hidden = true;
    toggle.hidden = false;
  }

  function handleUserMessage(text) {
    if (pendingReply) return;
    pendingReply = true;
    setQuickButtonsDisabled(true);
    addMessage(text, "user");
    addTyping();
    window.setTimeout(function () {
      removeTyping();
      addMessage(botReply(text), "bot");
      pendingReply = false;
      setQuickButtonsDisabled(false);
    }, 350);
  }

  function setQuickButtonsDisabled(disabled) {
    var buttons = quick.querySelectorAll(".sn-quick-btn");
    buttons.forEach(function (btn) {
      btn.disabled = disabled;
    });
  }

  toggle.addEventListener("click", openChat);
  closeBtn.addEventListener("click", closeChat);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    handleUserMessage(text);
    input.value = "";
  });

  quick.addEventListener("click", function (e) {
    if (!e.target.classList.contains("sn-quick-btn")) return;
    var text = e.target.textContent || "";
    if (!text) return;
    input.value = "";
    handleUserMessage(text);
  });

  addMessage(
    "Hi! I can help with packages, pricing, and booking. What are you planning?",
    "bot"
  );
})();


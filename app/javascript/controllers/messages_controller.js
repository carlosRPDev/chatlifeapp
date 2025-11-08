import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["messages"]
  static values = { currentUserId: Number }

  connect() {
    console.log("✅ Connected MessagesController")
    console.log("🧩 currentUserId:", this.currentUserIdValue)

    const messagesEl = this.messagesTarget || document.getElementById("messages")

    if (messagesEl) {
      // Procesa mensajes existentes al cargar
      messagesEl.querySelectorAll("[data-message-user-id]").forEach(n => this.processMessageNode(n))

      // Observa nuevos mensajes agregados dinámicamente
      this.observer = new MutationObserver(mutations => {
        for (const m of mutations) {
          for (const node of m.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.processMessageNode(node)
            }
          }
        }
      })

      this.observer.observe(messagesEl, { childList: true, subtree: true })
    }
  }

  disconnect() {
    if (this.observer) this.observer.disconnect()
  }

  processMessageNode(node) {
    const wrapper =
      node.matches && node.matches("[data-message-user-id]")
        ? node
        : node.querySelector("[data-message-user-id]")
    if (!wrapper) return

    const authorId = wrapper.dataset.messageUserId
    if (!authorId || !this.currentUserIdValue) return

    const box = wrapper.querySelector(".message-box")

    if (String(authorId) === String(this.currentUserIdValue)) {
      wrapper.classList.add("self")
      if (box) box.classList.add("msg-self")
    } else {
      wrapper.classList.remove("self")
      if (box) box.classList.remove("msg-self")
    }
  }
}

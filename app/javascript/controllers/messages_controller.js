import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["messages"]
  static values = { currentUserId: Number }

  connect() {
    console.log("✅ Connected MessagesController")
    console.log("🧩 currentUserId:", this.currentUserIdValue)

    this.messagesContainer = this.messagesTarget || document.getElementById("messages")

    if (this.messagesContainer) {
      // Procesa mensajes existentes al cargar
      this.messagesContainer
        .querySelectorAll("[data-message-user-id]")
        .forEach(n => this.processMessageNode(n))

      // Observa nuevos mensajes agregados dinámicamente
      this.observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.processMessageNode(node)
              // Esperamos un microtiempo para que el DOM termine de renderizar y luego hacemos scroll
              setTimeout(() => this.scrollToBottom(), 100)
            }
          }
        }
      })

      this.observer.observe(this.messagesContainer, { childList: true, subtree: true })

      // 🪄 Solo al conectar hacemos scroll inicial (después de renderizar todos los mensajes)
      setTimeout(() => this.scrollToBottom(), 200)
    } else {
      console.error("❌ No se encontró el contenedor de mensajes (#messages)")
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
      box?.classList.add("msg-self")
    } else {
      wrapper.classList.remove("self")
      box?.classList.remove("msg-self")
    }
  }

  // 🚀 Desplaza hacia abajo al último mensaje
  scrollToBottom() {
    if (!this.messagesContainer) return

    this.messagesContainer.scrollTo({
      top: this.messagesContainer.scrollHeight,
      behavior: "smooth"
    })
  }
}

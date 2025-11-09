import { Controller } from "@hotwired/stimulus"
import { fixMobileViewport } from "helpers/fix_mobile_viewport"

export default class extends Controller {
  static targets = ["panel", "sidebar"]

  connect() {
    console.log("✅ ChatController conectado")

    // Escuchar evento global para permitir cierre desde dentro del turbo-frame
    window.addEventListener("chat:close", this.close.bind(this))

    if (window.innerWidth < 768) fixMobileViewport() // ✅ solo mobile

    if (this.hasPanelTarget && this.panelTarget.dataset.chatOpen === "true") {
      this.open()
    }
  }

  disconnect() {
    window.removeEventListener("chat:close", this.close.bind(this))
  }

  open() {
    if (!this.hasSidebarTarget || !this.hasPanelTarget) return
    this.panelTarget.classList.add("active")
    this.sidebarTarget.classList.add("hidden")
  }

  close() {
    if (!this.hasSidebarTarget || !this.hasPanelTarget) return
    this.panelTarget.classList.remove("active")
    this.sidebarTarget.classList.remove("hidden")

    // 🧹 Limpia el frame del chat (opcional)
    const chatFrame = document.querySelector("#chat_panel")
    if (chatFrame) {
      chatFrame.innerHTML = `
        <div class="welcome-message text-center">
          <h2 class="neon-text">✨ Bienvenido a ChatLifeApp ✨</h2>
          <p class="text-muted">Selecciona un chat o crea un nuevo room para comenzar.</p>
        </div>
      `
    }
  }

  // Permite que botones dentro del turbo-frame disparen el cierre globalmente
  dispatchClose() {
    window.dispatchEvent(new Event("chat:close"))
  }
}

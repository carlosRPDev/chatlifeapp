import { Application } from "@hotwired/stimulus"

document.addEventListener("turbo:load", () => {
  if (!window.TurboStreamsConnected) {
    Turbo.connectStreamSource(new WebSocket(`${window.location.origin.replace(/^http/, 'ws')}/cable`))
    window.TurboStreamsConnected = true
  }
})

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    Turbo.connectStreamSource(new WebSocket(`${window.location.origin.replace(/^http/, 'ws')}/cable`))
  }
})

const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus = application

export { application }

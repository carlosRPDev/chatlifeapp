export function fixMobileViewport() {
  const chatArea = document.querySelector('.chat-area')
  if (!chatArea) return

  const adjustHeight = () => {
    chatArea.style.height = `${window.innerHeight - 56}px`
  }

  adjustHeight()
  window.addEventListener('resize', adjustHeight)
}

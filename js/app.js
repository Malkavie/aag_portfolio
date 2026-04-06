// Main menu elements (button and container)
const menuButton = document.getElementById('menuToggle')
const menuPanel = document.getElementById('menuPanel')
// Obtains the links in each menu
const menuLinks = menuPanel.querySelectorAll('a')

// Sets initial state (closed)
let isMenuOpen = false
let isSubmenuOpen = false

// Helper: toggle tab accessibility
function setMenuAccessibility(isOpen) {
  menuLinks.forEach(link => {
    if (isOpen) {
      link.setAttribute('tabindex', '0')
    } else {
      link.setAttribute('tabindex', '-1')
    }
  })
}

// Initialize (menu closed)
setMenuAccessibility(false)

// Menu Toggle
if (menuButton) {
  menuButton.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen
    // Toggle class
    menuPanel.classList.toggle('menuOpen', isMenuOpen)
    // Update ARIA
    menuButton.setAttribute('aria-expanded', isMenuOpen)
    // Update accessibility
    setMenuAccessibility(isMenuOpen)
  })
}
function toggleSubmenu(el) {
  isSubmenuOpen = !isSubmenuOpen
  // Select element and toggle class
  const panel = el.nextElementSibling
  panel.classList.toggle('submenuOpen', isSubmenuOpen)
  // Update ARIA
  el.setAttribute('aria-expanded', isSubmenuOpen)
}

// Cerrar con tecla Esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMenuOpen) {
    isMenuOpen = false
    menuPanel.classList.remove('menuOpen')
    menuButton.setAttribute('aria-expanded', 'false')
    setMenuAccessibility(false)
  }
})
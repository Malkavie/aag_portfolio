const menuButton = document.getElementById('menuToggle')
const menuPanel = document.getElementById('menuPanel')
const menuLinks = menuPanel.querySelectorAll('a')
let isMenuOpen = false // Initial state

// Helper: toggle tab accessibility
function setMenuAccessibility(isOpen) {
  menuLinks.forEach(link => {
    if (isOpen) {
      link.removeAttribute('tabindex');
    } else {
      link.setAttribute('tabindex', '-1');
    }
  });
}

// Initialize (menu closed)
setMenuAccessibility(false);

// Menu Toggle
if (menuButton) {
  menuButton.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    // Toggle class
    menuPanel.classList.toggle('menu-open', isMenuOpen)
    // Update ARIA
    menuButton.setAttribute('aria-expanded', isMenuOpen)
    // Update accessibility
    setMenuAccessibility(isMenuOpen)
  })
}

// Cerrar con tecla Esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMenuOpen) {
    isMenuOpen = false;
    menuPanel.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    setMenuAccessibility(false);
  }
})
const button = document.getElementById("langToggle")
const page = document.body.getAttribute("data-page")
let setLang = localStorage.getItem("lang")
let currentLang
let titles

if (setLang === "en" || setLang === "es") {
  // Set Language
  currentLang = setLang
} else {
  // Set Language
  currentLang= document.documentElement.getAttribute("lang")
  // Default to English
  if (currentLang !== "en" && currentLang !== "es") {
    currentLang = "en"
  }
  // Save Language
  localStorage.setItem("lang", currentLang)
}

applyLanguage(currentLang);

// Confirm that the language button is present
if (button) {
  // Assign event listener
  button.addEventListener("click", () => { 
    // Toggle language
    currentLang = currentLang === "en" ? "es" : "en"
    // Save language
    localStorage.setItem("lang", currentLang)
    // Apply Language
    applyLanguage(currentLang)
  });
}

// Change language
function applyLanguage(lang) {
  // Define page titles in different languages
  const titles = {
    en: {
      portfolio: "Portfolio",
      cv: "Resume",
      demo: "Demo"
    },
    es: {
      portfolio: "Portafolio",
      cv: "CV",
      demo: "Demo"
    }
  }
  // Select the title according to language and page || set initial value
  const pageName = titles[lang][page] || "Portfolio"
  const langTag = document.getElementById("langTag")
  langTag.textContent = lang === "en" ? "ES" : "EN"
  // Apply page title
  document.title = `AAG | ${pageName}`
  // Update <html lang="">
  document.documentElement.setAttribute("lang", lang)
  // Show/Hide elements according to selected language
  document.querySelectorAll("[data-lang]").forEach(el => {
    if (el.getAttribute("data-lang") === currentLang) {
      el.classList.remove("hidden")
    } else {
      el.classList.add("hidden")
    }
  })
}
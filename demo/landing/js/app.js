// INITIAL VALUES
const appContainer = document.querySelector('#mainApp') // App Container
let currentLang = 'en' // Default Language
let allContent = {} // Stores the content in all languages, fixed
let content = {} // Stores the information for the current language only, dynamically modified


// LOAD CONTENT OBJECT (en or es)
async function loadContent() {
  try {
    const response = await fetch('assets/content.json')
    allContent = await response.json()
    content = allContent[currentLang]
  } catch (error) {
    console.error('Error:', error)
  }
}

// CHANGE LANGUAGE (NOT IMPLEMENTED YET)
function setLanguage(lang) {
  if (!allContent[lang]) return
  currentLang = lang
  content = allContent[lang]
  // Re-render here
}

// LOAD TEMPLATE
async function loadTemplate(name) {
  const response = await fetch('templates/'+ name + '.html')
  const template = await response.text()
  return template
}

// INJECT TEMPLATES
async function testLoad(temp) {
  // Loads the template from an html file, where temp is the name of the file
  const templateHere = await loadTemplate(temp)
  // Selects the content for the section
  const contentHere =  content[temp]
  // Sets a default, generic container if tag is empty
  const tag = contentHere?.tag || 'div'
  const isMain = contentHere?.main === true
  // Creates the html container and assigns an id attribute
  const el = document.createElement(tag)
  el.setAttribute('id', temp + '-container')
  // Injects the template into the created element
  el.innerHTML = templateHere
  // Detects and selects elements with data-bind attribute, must have for content
  const bindElements = el.querySelectorAll('[data-bind]')
  const repeatContainers = el.querySelectorAll('[data-repeat]')

  repeatContainers.forEach(container => {
    const key = container.getAttribute('data-repeat')
    const items = contentHere[key]
    const art = container.querySelector('article')
    const template = art.innerHTML
    container.innerHTML = ''
    items.forEach(item => {
      const tempEl = document.createElement('article')
      tempEl.innerHTML = template
      const bindElements = tempEl.querySelectorAll('[data-bind]')
      bindElements.forEach(elm => {
        const path = elm.getAttribute('data-bind')
        const value = getValue(item, path)
        console.log(elm, path, value)
        if (value !== undefined && value !== null) {
          if(elm.tagName === 'IMG') {
            elm.setAttribute('src', value)
          } else {
            elm.textContent = value
          }
        }
      })
      container.appendChild(tempEl)
    })
  })
  // Binds the content to the elements with data-bind
  bindElements.forEach(elm => {
    const path = elm.getAttribute('data-bind')
    const value = getValue(contentHere, path)
    if(value !== undefined && value !== null) {
      elm.textContent = value
    }
  })
  // Determines if we append the element inside body or inside another element
  if (isMain) {
    // Processes the sections and inserts them in the main container
    createMain(el)
  } else {
    // Appends the element and the content to the app container
    appContainer.appendChild(el)
  }
}

function getValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

function createMain(el) {
  // Fids if main tag is present
  let main = document.querySelector('main')
  if (!main) {
    // Creates main element if not present
    main = document.createElement('main')
    // Sets main id attribute to main
    main.setAttribute('id', 'main-container')
    // Adds the section to the main-container
    main.appendChild(el)
    // Adds the main container
    appContainer.appendChild(main)
  } else {
    // Add element directly to main-container if already exists
    main.appendChild(el)
  }
}

// INITIALIZATION
async function init() {
  await loadContent()
  await testLoad('hero')
  await testLoad('value')
}
init()
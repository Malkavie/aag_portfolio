/* DEFINE STAGES */
const stages = [
  "Marriage",
  "Body",
  "Paint",
  "Assembly",
  "Interior",
  "QA",
  "Testing",
  "Complete"
]
const svg = document.getElementById("lineSvg")

/* ASSEMBLY LINE */
const line = document.createElementNS("http://www.w3.org/2000/svg", "line")

line.setAttribute("x1", 40)
line.setAttribute("y1", 60)
line.setAttribute("x2", 950)
line.setAttribute("y2", 60)
line.setAttribute("stroke", "#94a3b8")
line.setAttribute("stroke-width", "2")
svg.appendChild(line)

/* WORK AREAS */
const nodes = []
const spacing = 910 / (stages.length - 1)

stages.forEach((stage, index) => {
  const x = 40 + index * spacing

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")

  circle.setAttribute("cx", x)
  circle.setAttribute("cy", 60)
  circle.setAttribute("r", 8)
  circle.setAttribute("fill", "#1e293b")
  svg.appendChild(circle)
  nodes.push(circle)

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text")

  text.setAttribute("x", x)
  text.setAttribute("y", 90)
  text.setAttribute("text-anchor", "middle")
  text.setAttribute("fill", "#94a3b8")
  text.setAttribute("font-size", "10")
  text.textContent = stage
  svg.appendChild(text)
})

/* VEHICLE */
const vehicle = document.createElementNS("http://www.w3.org/2000/svg", "rect")

vehicle.setAttribute("x", 30)
vehicle.setAttribute("y", 50)
vehicle.setAttribute("width", 20)
vehicle.setAttribute("height", 20)
vehicle.setAttribute("rx", 4)
vehicle.setAttribute("fill", "#997016")
vehicle.setAttribute("id", "vehicle")
svg.appendChild(vehicle)

/* PRODUCTION DATA */
let isRunning = true;
let currentStage = 0
let vehiclesProcessed = 0
let progress = 0
const vehicleData = {
  vin: "1HGCM82633A123456",
  model: "Sedan LX",
  market: "US"
}
const vinEl = document.getElementById("vin")
const modelEl = document.getElementById("model")
const marketEl = document.getElementById("market")
const statusEl = document.getElementById("status")
const stageEl = document.getElementById("stage")
const progressEl = document.getElementById("progress")
const countEl = document.getElementById("count")
const timeEl = document.getElementById("timestamp")
  /* Updates the position and moves the vehicle */ 
function updateVehiclePosition() {
  const x = 40 + currentStage * spacing

  vehicle.setAttribute("x", x - 10)

  nodes.forEach((node, index) => {
    if (index < currentStage) {
        node.setAttribute("fill", "#38bdf8") // completado
    } else if (index === currentStage) {
        node.setAttribute("fill", "#997016") // actual
    } else {
        node.setAttribute("fill", "#1e293b") // pendiente
    }
  })
}
  /* Updates the vehicle information */
function updateInfoPanel() {
  vinEl.textContent = vehicleData.vin
  modelEl.textContent = vehicleData.model
  marketEl.textContent = vehicleData.market
  statusEl.textContent = vehicleState
  stageEl.textContent = stages[currentStage]
}
  /* Updates the progress information */
function updateStats(stage) {
  progress = Math.floor((stage / (stages.length - 1)) * 100)
  progressEl.textContent = progress + "%"
  countEl.textContent = vehiclesProcessed
}
  /* Timestamp */
function updateTimestamp() {
  const now = new Date();
  const timeString = now.toLocaleTimeString (currentLang === "es" ? "es-MX" : "en-US")
  timeEl.textContent = (currentLang === "es" ? "Actualizado: " : "Updated: ") + timeString
}
  /* Force error */
let makeError = false
function forceError() {
  makeError = true;
}
  /* Simulates an error in the line */
let vehicleState = "OK"
let previousState = "OK"
vehicle.setAttribute("fill", "#997016")
statusEl.style.color = "#38bdf8"
function vehicleStatus() {
  if (makeError) {
    vehicleState = "ERROR"
    makeError = false
  }
  else if (previousState === "ERROR") {
    vehicleState = "OK"
  }
  else {
    let status = Math.random()
    vehicleState = status > 0.8 ? "ERROR" : "OK"
    console.log(status)
  }
  previousState = vehicleState
  if (vehicleState === "ERROR") {
    vehicle.setAttribute("fill", "#ef4444")
    statusEl.style.color = "#ef4444"
  } else {
    vehicle.setAttribute("fill", "#997016")
    statusEl.style.color = "#38bdf8"
  }
}
  /* Pause the app */
function toggleRun (el) {
  isRunning = !isRunning;
  el.textContent = (currentLang === "en" ? (isRunning ? "Pause" : "Resume") : (isRunning ? "Pausar" : "Reiniciar"))
}
  /* Loads initial information */
updateInfoPanel()
updateStats(0)

/* UPDATE APP */
setInterval(() => {
  if (!isRunning) return;
  currentStage++
  if (currentStage >= stages.length) { 
    currentStage = 0
    vehiclesProcessed++;
    vehicle.style.transition = "none"; // removes animation in final to reset position
    updateVehiclePosition()
    vehicleStatus()
    updateTimestamp();
    setTimeout(() => {
      vehicle.style.transition = "x 0.6s ease"; // restores flow animation in all stages
    }, 50);
  } else {
    updateVehiclePosition()
    updateTimestamp();
  }
  updateInfoPanel()
  updateStats(currentStage)
}, 3000)
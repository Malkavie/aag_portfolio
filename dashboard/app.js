/* ***** CHARTS APP ***** */

const tooltip = document.getElementById('tooltip')

function positionTooltip(cx, cy, svg) {
  const rect = svg.getBoundingClientRect()
  const { width: vbWidth, height: vbHeight } = getViewBox(svg)

  const scrollX = window.scrollX
  const scrollY = window.scrollY

  const x = rect.left + scrollX + (cx / vbWidth) * rect.width
  const y = rect.top + scrollY + (cy / vbHeight) * rect.height

  const tooltipWidth = tooltip.offsetWidth || 80
  const tooltipHeight = tooltip.offsetHeight || 40

  let left = x
  let top = y - tooltipHeight

  tooltip.style.left = `${left}px`
  tooltip.style.top = `${top}px`
}

function getViewBox(svg) {
  const vb = svg.viewBox.baseVal

  return {
    x: vb.x,
    y: vb.y,
    width: vb.width,
    height: vb.height
  }
}

function lineChart() {
  // Data enters here - this is mockup data
  const data = [1200, 1900, 1700, 2200, 2600, 3000, 2800]
  const labels = [
    "Monday", 
    "Tuesday", 
    "Wednesday", 
    "Thursday", 
    "Friday", 
    "Saturday",
    "Sunday"
  ]
  
  // Get container for chart
  const svg = document.getElementById("lineChart")
  
  // Container dimensions
  const { width: vbWidth, height: vbHeight} = getViewBox(svg)
  const padding = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 50
  }
  const chartWidth = vbWidth - padding.left - padding.right
  const chartHeight = vbHeight - padding.top - padding.bottom
  const maxValue = Math.max(...data)
  const minValue = 0

  // Scale functions
  const xScale = (index) =>
    padding.left + (index / (data.length - 1)) * chartWidth

  const yScale = (value) =>
    padding.top + (1 - (value - minValue) / (maxValue - minValue)) * chartHeight

  //Creates svg groups for accesibility
  const xGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  xGroup.setAttribute("aria-hidden", true)

  const yGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  yGroup.setAttribute("aria-hidden", true)

  const chartGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  chartGroup.setAttribute("aria-hidden", true)

  const extraGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  extraGroup.setAttribute("aria-hidden", true)

  const markGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  markGroup.setAttribute("aria-hidden", false)

  svg.appendChild(xGroup)
  svg.appendChild(yGroup)
  svg.appendChild(chartGroup)
  svg.appendChild(extraGroup)
  svg.appendChild(markGroup)

  // Creates y-axis labels and lines (vertical)
  const gridLines = data.length

  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + (i / gridLines) * chartHeight
    const value = maxValue * (1 - i / gridLines)

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
    
    line.setAttribute("x1", padding.left)
    line.setAttribute("x2", vbWidth - padding.right)
    line.setAttribute("y1", y)
    line.setAttribute("y2", y)

    line.setAttribute("stroke", "#334155")
    line.setAttribute("stroke-width", "1")
    line.setAttribute("stroke-opacity", "0.3")

    yGroup.appendChild(line)

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
    
    text.setAttribute("x", padding.left - 10)
    text.setAttribute("y", y)
    text.setAttribute("text-anchor", "end")
    text.setAttribute("fill", "#94a3b8")
    text.setAttribute("font-size", "10")
    text.textContent = `$${Math.round(value)}`

    yGroup.appendChild(text)
  }

  // Creates x-axis labels and lines (horizontal)
  labels.forEach((label, index) => {
    const x = xScale(index)
    const y = vbHeight - padding.bottom + 15

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
    line.setAttribute("x1", x)
    line.setAttribute("x2", x)
    line.setAttribute("y1", padding.top)
    line.setAttribute("y2", vbHeight - padding.bottom)

    line.setAttribute("stroke", "#334155")
    line.setAttribute("stroke-width", "1")
    line.setAttribute("stroke-opacity", "0.3")

    xGroup.appendChild(line)

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text")

    text.setAttribute("x", x)
    text.setAttribute("y", y)
    text.setAttribute("text-anchor", "middle")
    text.setAttribute("fill", "#94a3b8")
    text.setAttribute("font-size", "10")
    text.textContent = label

    xGroup.appendChild(text)
  })

  // Generates path coordinates
  let pathD = ""

  data.forEach((value, index) => {
    const x = xScale(index)
    const y = yScale(value)

    if (index === 0) {
      pathD += `M ${x} ${y}`
    } else {
      pathD += ` L ${x} ${y}`
    }
  })

  // Creates line path
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path")

  path.setAttribute("d", pathD)
  path.setAttribute("fill", "none")
  path.setAttribute("stroke", "#3b82f6")
  path.setAttribute("stroke-width", "2.5")
  path.setAttribute("stroke-linecap", "round")
  path.setAttribute("stroke-linejoin", "round")
  path.style.filter = "drop-shadow(0 0 6px rgba(198, 204, 214, 0.4))"

  // Creates area
  const areaPathD = `
    ${pathD}
    L ${xScale(data.length - 1)} ${vbHeight - padding.bottom}
    L ${xScale(0)} ${vbHeight - padding.bottom}
    Z`
  const area = document.createElementNS("http://www.w3.org/2000/svg", "path")

  area.setAttribute("d", areaPathD)
  area.setAttribute("fill", "rgba(59,130,246,0.1)")
  area.style.opacity = "0"

  chartGroup.appendChild(area)
  chartGroup.appendChild(path)

  // Animates the path
  const length = path.getTotalLength()

  path.style.strokeDasharray = length
  path.style.strokeDashoffset = length

  requestAnimationFrame(() => {
    path.style.transition = "stroke-dashoffset 1.5s ease"
    path.style.strokeDashoffset = "0"
  })

  setTimeout(() => {
    area.style.transition = "opacity 0.8s ease"
    area.style.opacity = "1"
  }, 1500 + 150)

  // Hover tracking line
  const hoverLine = document.createElementNS("http://www.w3.org/2000/svg", "line")

  hoverLine.setAttribute("y1", padding.top)
  hoverLine.setAttribute("y2", vbHeight - padding.bottom)
  hoverLine.setAttribute("stroke", "#94a3b8")
  hoverLine.setAttribute("stroke-width", "1")
  hoverLine.setAttribute("stroke-dasharray", "4 4")
  hoverLine.style.opacity = "0"
  hoverLine.style.transition = "opacity 0.8s ease"

  extraGroup.appendChild(hoverLine)

  // Adds circle markers - interactive tooltips
  data.forEach((value, index) => {
    const cx = xScale(index)
    const cy = yScale(value)
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    const circleOut = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    // Creates the visual marker
    circle.setAttribute("cx", cx)
    circle.setAttribute("cy", cy)
    circle.setAttribute("r", "3.5")
    circle.setAttribute("fill", "#3b82f6")

    circle.setAttribute("aria-hidden", true)

    // Creates a bigger circle for interactivity/accesibility purposes
    circleOut.setAttribute("cx", cx)
    circleOut.setAttribute("cy", cy)
    circleOut.setAttribute("r", "6")
    circleOut.setAttribute("fill", "transparent")
    circleOut.style.cursor = "pointer"

    circleOut.setAttribute("tabindex", "0")
    circleOut.setAttribute("role", "img")
    circleOut.setAttribute(
      "aria-label",
      `${labels[index]} revenue: $${value}`
    )

    // Appends the elements to the drawing
    markGroup.appendChild(circle)
    markGroup.appendChild(circleOut)
    
    // Interactivity: Shows/Hides tooltip with data information

    //Mouse events
    circleOut.addEventListener("mousemove", (e) => {
      tooltip.style.opacity = 1
      tooltip.style.left = e.pageX + 10 + "px"
      tooltip.style.top = e.pageY - 30 + "px"
      tooltip.textContent = `${labels[index]}: $${value}`
    })
    circleOut.addEventListener("mouseleave", () => {
      tooltip.style.opacity = 0
    })

    //Keyboard events
    circleOut.addEventListener("focus", (e) => {
      tooltip.style.opacity = 1
      tooltip.style.visibility = "hidden"
      tooltip.textContent = `${labels[index]}: $${value}`
      positionTooltip(cx, cy, svg, vbWidth, vbHeight)
      tooltip.style.visibility = "visible"
    })
    circleOut.addEventListener("blur", () => {
      tooltip.style.opacity = 0
    })

    // Interactivity: Shows/Hides tracking line

    // Mouse events
    circleOut.addEventListener("mouseenter", () => {
      hoverLine.style.opacity = "1"
      hoverLine.setAttribute("x1", cx)
      hoverLine.setAttribute("x2", cx)
    })
    circleOut.addEventListener("mouseleave", () => {
      hoverLine.style.opacity = "0"
    })
    // Keyboard events
    circleOut.addEventListener("focus", () => {
      hoverLine.style.opacity = "1"
      hoverLine.setAttribute("x1", cx)
      hoverLine.setAttribute("x2", cx)
    })
    circleOut.addEventListener("blur", () => {
      hoverLine.style.opacity = "0"
    })
  })

  // Add effects and gradients
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")

  defs.innerHTML = `
    <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </linearGradient>

    <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
    </linearGradient>
  `
  svg.appendChild(defs)

  path.setAttribute("stroke", "url(#lineGradient)")
  area.setAttribute("fill", "url(#areaGradient)")
}

function barChart() {
  // Mockup data
  const data = [320, 150, 200, 100, 190]
  const labels = [
    "Headphones",
    "Smart Watches",
    "Sneakers",
    "Backpack",
    "Sunglasses"
  ]
  
  // Get chart container
  const svg = document.getElementById("barChart")
  
  // Dimensions (must match your SVG)
  const { width: vbWidth, height: vbHeight} = getViewBox(svg)
  const padding = { 
    top: 30, 
    right: 10, 
    bottom: 40, 
    left: 40 
  }
  const chartWidth = vbWidth - padding.left - padding.right
  const chartHeight = vbHeight - padding.top - padding.bottom
  const maxValue = Math.max(...data)
  const barWidth = chartWidth / data.length * 0.6
  const gap = chartWidth / data.length * 0.4

  // Scale functions
  const xScale = (index) =>
    padding.left + index * (barWidth + gap)

  const yScale = (value) =>
    padding.top + (1 - value / maxValue) * chartHeight

  //Creates svg groups for accesibility
  const xGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  xGroup.setAttribute("aria-hidden", true)

  const yGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  yGroup.setAttribute("aria-hidden", true)

  const barsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  barsGroup.setAttribute("aria-hidden", false)

  svg.appendChild(xGroup)
  svg.appendChild(yGroup)
  svg.appendChild(barsGroup)

  // Creates y-axis labels and lines (vertical)
  const gridLines = data.length

  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + (i / gridLines) * chartHeight
    const value = maxValue * (1 - i / gridLines)

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line")

    line.setAttribute("x1", padding.left - 15)
    line.setAttribute("x2", vbWidth - padding.right -  15)
    line.setAttribute("y1", y)
    line.setAttribute("y2", y)

    line.setAttribute("stroke", "#334155")
    line.setAttribute("stroke-width", "1")
    if (i === gridLines) {
      line.setAttribute("stroke-opacity", "1")
    } else {
      line.setAttribute("stroke-opacity", "0.3")
    }

    yGroup.appendChild(line)

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text")

    text.setAttribute("x", padding.left - 20)
    text.setAttribute("y", y)
    text.setAttribute("text-anchor", "end")
    text.setAttribute("fill", "#94a3b8")
    text.setAttribute("font-size", "10")
    text.textContent = Math.round(value)

    yGroup.appendChild(text)
  }

  // Creates x-axis labels (horizontal)
  labels.forEach((label, index) => {
    const x = xScale(index) + barWidth / 2
    const y = vbHeight - padding.bottom + 15

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text")

    text.setAttribute("x", x)
    text.setAttribute("y", y)
    text.setAttribute("text-anchor", "middle")
    text.setAttribute("fill", "#94a3b8")
    text.setAttribute("font-size", "10")

    text.textContent = label

    xGroup.appendChild(text)
  })

  // Creates bars
  data.forEach((value, index) => {
    const x = xScale(index)
    const y = yScale(value)
    const height = chartHeight - (y - padding.top)

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")

    rect.setAttribute("x", x)
    rect.setAttribute("y", vbHeight - padding.bottom) // start from bottom
    rect.setAttribute("width", barWidth)
    rect.setAttribute("height", 0)
    rect.setAttribute("rx", "4") // rounded corners
    rect.setAttribute("fill", "#3b82f6")
    rect.style.cursor = "pointer"
    
    rect.setAttribute("tabindex", "0")
    rect.setAttribute("role", "img")
    rect.setAttribute(
      "aria-label",
      `${labels[index]} sales: ${value}`
    )

    const valueLabel = document.createElementNS("http://www.w3.org/2000/svg", "text")
    
    valueLabel.setAttribute("x", x + barWidth / 2)
    valueLabel.setAttribute("y", y - 6)
    valueLabel.setAttribute("text-anchor", "middle")
    valueLabel.setAttribute("fill", "#e2e8f0")
    valueLabel.setAttribute("font-size", "10")
    valueLabel.setAttribute("opacity", "0")

    valueLabel.setAttribute("aria-hidden", true)

    valueLabel.textContent = value

    const highlight = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    
    highlight.setAttribute("x", x - gap / 4)
    highlight.setAttribute("y", padding.top)
    highlight.setAttribute("width", barWidth + gap / 2)
    highlight.setAttribute("height", chartHeight)
    highlight.setAttribute("fill", "#ffffff")
    highlight.setAttribute("opacity", "0")

    highlight.setAttribute("aria-hidden", true)

    // Staggered animation for the bars
    setTimeout(() => {
      rect.style.transition = "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)"
      highlight.style.transition = "opacity 0.5s"
      valueLabel.setAttribute("opacity", "1")
      valueLabel.style.transition = "opacity 3s"
      rect.setAttribute("y", y)
      rect.setAttribute("height", height)
    }, index * 300)

    // Add a gradient effect to the bar
    rect.setAttribute("fill", "url(#barGradient)")

    // Inserts created bar
    barsGroup.appendChild(highlight)
    barsGroup.appendChild(rect)
    barsGroup.appendChild(valueLabel)

    // Interactivity: Shows/Hides tooltip with data information

    // Mouse events
    rect.addEventListener("mouseenter", (e) => {
      rect.style.filter = "brightness(1.5) drop-shadow(0 4px 10px rgba(59,130,246,0.3))"
      highlight.setAttribute("opacity", "0.05")
      tooltip.style.opacity = 1
      tooltip.style.left = e.pageX + "px"
      tooltip.style.top = e.pageY + "px"
      tooltip.textContent = `${labels[index]}: ${value}`
    })
    rect.addEventListener("mouseleave", () => {
      rect.style.filter = "none"
      highlight.setAttribute("opacity", "0")
      tooltip.style.opacity = 0
    })
    rect.addEventListener("mousemove", (e) => {
      tooltip.style.opacity = 1
      tooltip.textContent = `${labels[index]}: ${value}`

      tooltip.style.left = e.pageX + 10 + "px"
      tooltip.style.top = e.pageY - 30 + "px"
    })

    // Keyboard events
    rect.addEventListener("focus", (e) => {
      rect.style.filter = "brightness(1.5) drop-shadow(0 4px 10px rgba(59,130,246,0.3))"
      highlight.setAttribute("opacity", "0.05")
      tooltip.style.opacity = 1
      tooltip.style.visibility = "hidden"
      tooltip.textContent = `${labels[index]}: ${value}`
      positionTooltip(x + barWidth / 2, y, svg, vbWidth, vbHeight)
      tooltip.style.visibility = "visible"
    })
    rect.addEventListener("blur", () => {
      rect.style.filter = "none"
      highlight.setAttribute("opacity", "0")
      tooltip.style.opacity = 0
    })
  })

  // Add effect and gradient
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")

  defs.innerHTML = `
    <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0%" stop-color="#3b82f6"/>
    <stop offset="100%" stop-color="#1e40af"/>
    </linearGradient>
  `
  svg.appendChild(defs)
}

function donutChart() {
  // Mockup data
  const data = [60, 25, 15]
  const labels = ["Online", "Retail", "Wholesale"]

  // Get chart container
  const svg = document.getElementById("donutChart")

  // Dimensions
  const { width: vbWidth, height: vbHeight} = getViewBox(svg)
  
  const radius = 70
  const cx = vbWidth / 2
  const cy = (vbHeight / 2) + (radius / 2)
  const circumference = 2 * Math.PI * radius

  // Texto a la derecha del chart
  const legendX = 10
  const legendStartY = 10
  const legendSpacing = 24

  // Creates svg groups for accesibility
  const chartGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  chartGroup.setAttribute("aria-hidden", false)

  const labelsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  labelsGroup.setAttribute("aria-hidden", true)

  svg.appendChild(chartGroup)
  svg.appendChild(labelsGroup)

  // Adds effects and gradients
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")

  defs.innerHTML = `
    <linearGradient id="donutGradient1" x1="0" x2="1">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1e40af"/>
    </linearGradient>
    <linearGradient id="donutGradient2" x1="0" x2="1">
      <stop offset="0%" stop-color="#22c55e"/>
      <stop offset="100%" stop-color="#166534"/>
    </linearGradient>
    <linearGradient id="donutGradient3" x1="0" x2="1">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
  `
  svg.appendChild(defs)

  // Creates center label
  const centerText = document.createElementNS("http://www.w3.org/2000/svg", "text")
  
  centerText.setAttribute("x", cx)
  centerText.setAttribute("y", cy + 5)
  centerText.setAttribute("text-anchor", "middle")
  centerText.setAttribute("fill", "#e2e8f0")
  centerText.setAttribute("font-size", "20")
  centerText.style.transition = "all 1.5s ease"
  centerText.style.opacity = 0
  centerText.textContent = "100%"

  setTimeout(() => {
    centerText.style.opacity = 1
  }, 500)

  labelsGroup.appendChild(centerText)

  // Creates segments
  let offset = 0

  data.forEach((value, index) => {
    // Label group positioning
    const y = legendStartY + index * legendSpacing
    
    // Creates label group
    const groupie = document.createElementNS("http://www.w3.org/2000/svg", "g")
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text")

    dot.setAttribute("cx", legendX)
    dot.setAttribute("cy", y)
    dot.setAttribute("r", "6")
    dot.setAttribute("fill", `url(#donutGradient${index + 1})`)

    text.setAttribute("x", legendX + 12)
    text.setAttribute("y", y + 4)
    text.setAttribute("fill", "#94a3b8")
    text.setAttribute("font-size", "10")

    text.textContent = `${labels[index]} (${value}%)`

    groupie.style.cursor = "pointer"

    groupie.appendChild(dot)
    groupie.appendChild(text)
    labelsGroup.appendChild(groupie)

    // Segment geometry
    const percentage = value / 100
    const gapAngle = 0.05

    const startAngle = (offset / circumference) * 2 * Math.PI
    const arcAngle = (percentage) * 2 * Math.PI - gapAngle
    const midAngle = startAngle + arcAngle / 2
    const tooltipRadius = radius + 5

    const dash = (arcAngle / (2 * Math.PI)) * circumference

    // Tooltip position
    const tx = cx + Math.cos(midAngle - Math.PI / 2) * tooltipRadius
    const ty = cy + Math.sin(midAngle - Math.PI / 2) * tooltipRadius

    // Creates segments
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")

    circle.setAttribute("cx", cx)
    circle.setAttribute("cy", cy)
    circle.setAttribute("r", radius)

    circle.setAttribute("fill", "none")
    circle.setAttribute("stroke", `url(#donutGradient${index + 1})`)
    circle.setAttribute("stroke-width", "20")
    circle.setAttribute("stroke-dasharray", `${dash} ${circumference - dash}`)
    circle.setAttribute("stroke-dashoffset", -offset)
    //circle.setAttribute("stroke-linecap", "round")

    circle.setAttribute("tabindex", "0")
    circle.setAttribute("role", "img")
    circle.setAttribute(
      "aria-label",
      `${labels[index]} revenue share: ${value}%`
    )

    circle.setAttribute("transform", `rotate(-90 ${cx} ${cy})`)
    circle.style.strokeDasharray = `0 ${circumference}`
    circle.style.filter = "drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
    circle.style.cursor = "pointer"
    circle.style.transition = "all 0.25s ease"

    // Adds the segment to the svg
    chartGroup.appendChild(circle)

    // Increases the offset for the next segment
    offset += dash +(gapAngle / (2 * Math.PI)) * circumference

    // Animation
    setTimeout(() => {
      circle.style.transition = `
        stroke-dasharray 1.5s cubic-bezier(0.22, 1, 0.36, 1),
        stroke-width 0.25s ease,
        filter 0.25s ease
        `
      circle.style.strokeDasharray = `${dash} ${circumference - dash}`
    }, index * 150)

    // Interactivity: Shows/Hides tooltip with data information

    // Mouse events
    circle.addEventListener("mouseenter", (e) => {
      circle.setAttribute("stroke-width", "25")
      circle.style.filter = `
        brightness(1.1)
        drop-shadow(0 6px 12px rgba(59,130,246,0.35))
      `
      tooltip.style.opacity = 1
      tooltip.style.left = e.pageX + "px"
      tooltip.style.top = e.pageY + "px"
      tooltip.textContent = `${labels[index]}: ${value}%`
      centerText.textContent = `${value}%`
    })
    groupie.addEventListener("mouseenter", (e) => {
      circle.setAttribute("stroke-width", "25")
      circle.style.filter = `
        brightness(1.1)
        drop-shadow(0 6px 12px rgba(59,130,246,0.35))
      `
      centerText.textContent = `${value}%`
    })
    circle.addEventListener("mouseleave", () => {
      circle.setAttribute("stroke-width", "20")
      circle.style.filter = "drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
      tooltip.style.opacity = 0
      centerText.textContent = "100%"
    })
    groupie.addEventListener("mouseleave", () => {
      circle.setAttribute("stroke-width", "20")
      circle.style.filter = "drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
      centerText.textContent = "100%"
    })
    circle.addEventListener("mousemove", (e) => {
      circle.setAttribute("stroke-width", "25")
      circle.style.filter = `
        brightness(1.1)
        drop-shadow(0 6px 12px rgba(59,130,246,0.35))
      `
      tooltip.style.opacity = 1
      tooltip.textContent = `${labels[index]}: ${value}%`
      centerText.textContent = `${value}%`

      tooltip.style.left = e.pageX + 10 + "px"
      tooltip.style.top = e.pageY - 30 + "px"
    })

    // Keyboard events
    circle.addEventListener("focus", (e) => {
      circle.setAttribute("stroke-width", "25")
      circle.style.filter = `
        brightness(1.1)
        drop-shadow(0 6px 12px rgba(59,130,246,0.35))
      `
      tooltip.style.opacity = 1
      tooltip.textContent = `${labels[index]}: ${value}%`
      centerText.textContent = `${value}%`
      positionTooltip(tx, ty, svg)
    })
    circle.addEventListener("blur", () => {
      circle.setAttribute("stroke-width", "20")
      circle.style.filter = "drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
      tooltip.style.opacity = 0
      centerText.textContent = "100%"
    })
  })
}

function pieChart() {
  // Mockup data
  const data = [60, 25, 15]
  const labels = ["Online", "Retail", "Wholesale"]

  // Get chart container
  const svg = document.getElementById("pieChart")

  // Dimensions
  const { width: vbWidth, height: vbHeight} = getViewBox(svg)

  const radius = 70
  const cx = vbWidth / 2
  const cy = (vbHeight / 2) + (radius / 2)
  const circumference = 2 * Math.PI * radius

  // Texto a la derecha del chart
  const legendX = 10
  const legendStartY = 10
  const legendSpacing = 24

  // Creates svg groups for accesibility
  const chartGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  chartGroup.setAttribute("aria-hidden", false)

  const labelsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  labelsGroup.setAttribute("aria-hidden", true)

  svg.appendChild(chartGroup)
  svg.appendChild(labelsGroup)

  // Creates segments
  let offset = 0
  let currentAngle = -Math.PI / 2

  function createPieSlice(cx, cy, radius, startAngle, endAngle) {
    const x1 = cx + radius * Math.cos(startAngle)
    const y1 = cy + radius * Math.sin(startAngle)

    const x2 = cx + radius * Math.cos(endAngle)
    const y2 = cy + radius * Math.sin(endAngle)

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0

    return `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `
  }

  data.forEach((value, index) => {
    // Label group positioning
    const y = legendStartY + index * legendSpacing

    // Creates label group
    const groupie = document.createElementNS("http://www.w3.org/2000/svg", "g")
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text")

    dot.setAttribute("cx", legendX)
    dot.setAttribute("cy", y)
    dot.setAttribute("r", "6")
    dot.setAttribute("fill", `url(#donutGradient${index + 1})`)

    text.setAttribute("x", legendX + 12)
    text.setAttribute("y", y + 4)
    text.setAttribute("fill", "#94a3b8")
    text.setAttribute("font-size", "10")

    text.textContent = `${labels[index]} (${value}%)`

    groupie.style.cursor = "pointer"

    groupie.appendChild(dot)
    groupie.appendChild(text)
    labelsGroup.appendChild(groupie)

    // Segment geometry
    const percentage = value / 100
    const gapAngle = 0.05

    const startAngle = (offset / circumference) * 2 * Math.PI
    const arcAngle = (percentage) * 2 * Math.PI - gapAngle
    const midAngle = startAngle + arcAngle / 2
    const tooltipRadius = radius - 10

    const sliceAngle = (value / 100) * 2 * Math.PI

    const dash = (arcAngle / (2 * Math.PI)) * circumference

    const start = currentAngle + gapAngle / 2
    const end = currentAngle + sliceAngle - gapAngle / 2

    // Tooltip position
    const tx = cx + Math.cos(midAngle - Math.PI / 2) * tooltipRadius
    const ty = cy + Math.sin(midAngle - Math.PI / 2) * tooltipRadius

    // Creates segments
    const d = createPieSlice(
      cx,
      cy,
      radius,
      currentAngle,
      currentAngle + sliceAngle
    )
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")

    path.setAttribute("d", d);
    path.setAttribute("fill", `url(#donutGradient${index + 1})`)

    path.setAttribute("tabindex", "0")
    path.setAttribute("role", "img")
    path.setAttribute(
      "aria-label",
      `${labels[index]} revenue share: ${value}%`
    )

    path.style.filter = "drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
    path.style.cursor = "pointer"
    path.style.transformOrigin = `${cx}px ${cy}px`
    path.style.opacity = "0"
    path.style.transform = "scale(0.1)"

    // Adds the segment to the svg
    chartGroup.appendChild(path)

    // Add a label, shown only on hover or focus
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text")

    label.setAttribute("x", tx)
    label.setAttribute("y", ty)
    label.setAttribute("text-anchor", "middle")
    label.setAttribute("fill", "#fff")
    label.setAttribute("font-size", "15")
    label.setAttribute("opacity", "0")
    label.classList.add("hidden")
    label.style.filter = "drop-shadow(0 6px 12px rgba(59,130,246,0.35))"
    label.style.transition = "opacity 0.5s ease"

    label.textContent = `${value}%`

    labelsGroup.appendChild(label)

    // Increases the angle for the next segment
    currentAngle += sliceAngle
    offset += dash +(gapAngle / (2 * Math.PI)) * circumference

    // Animation
    setTimeout (() => {
      path.style.transition = "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
      path.style.opacity = "1"
      path.style.transform = "scale(1)"
    }, index * 400)

    // Interactivity: Shows/Hides tooltip with data information

    // Mouse events
    path.addEventListener("mouseenter", (e) => {
      path.style.transform = "scale(1.1)"
      path.style.filter= `
        brightness(1.1)
        drop-shadow(0 6px 12px rgba(59,130,246,0.35))
      `
      tooltip.style.opacity = 1
      tooltip.style.left = e.pageX + "px"
      tooltip.style.top = e.pageY + "px"
      tooltip.textContent = `${labels[index]}: ${value}%`
    })
    groupie.addEventListener("mouseenter", (e) => {
      path.style.transform = "scale(1.1)"
      path.style.filter= `
        brightness(1.1)
        drop-shadow(0 6px 12px rgba(59,130,246,0.35))
      `
      label.classList.remove("hidden")
      label.setAttribute("opacity", "1")
    })
    path.addEventListener("mouseleave", () => {
      path.style.transform = "scale(1)"
      path.style.filter = "drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
      tooltip.style.opacity = 0
      label.classList.add("hidden")
      label.setAttribute("opacity", "0")
    })
    groupie.addEventListener("mouseleave", () => {
      path.style.transform = "scale(1)"
      path.style.filter = "drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
      label.classList.add("hidden")
      label.setAttribute("opacity", "0")
    })
    path.addEventListener("mousemove", (e) => {
      tooltip.style.opacity = 1
      tooltip.textContent = `${labels[index]}: ${value}%`

      tooltip.style.left = e.pageX + 10 + "px"
      tooltip.style.top = e.pageY - 30 + "px"
      label.classList.add("hidden")
      label.setAttribute("opacity", "0")
    })

    // Keyboard events
    path.addEventListener("focus", (e) => {
      path.style.transform = "scale(1.1)"
      path.style.filter= `
        brightness(1.1)
        drop-shadow(0 6px 12px rgba(59,130,246,0.35))
      `
      tooltip.style.opacity = 1
      tooltip.textContent = `${labels[index]}: ${value}%`
      positionTooltip(tx, ty, svg)
    })
    path.addEventListener("blur", () => {
      path.style.transform = "scale(1)"
      path.style.filter = "drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
      tooltip.style.opacity = 0
    })
  })
  // Adds effects and gradients
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")

  defs.innerHTML = `
    <linearGradient id="donutGradient1" x1="0" x2="1">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1e40af"/>
    </linearGradient>
    <linearGradient id="donutGradient2" x1="0" x2="1">
      <stop offset="0%" stop-color="#22c55e"/>
      <stop offset="100%" stop-color="#166534"/>
    </linearGradient>
    <linearGradient id="donutGradient3" x1="0" x2="1">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
  `
  svg.appendChild(defs)
}

lineChart()
barChart()
pieChart()

/* ***** MENU APP ***** */

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
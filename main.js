// 画线
let canvas = document.getElementById('canvas')
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight
canvas.style.background = "rgb(248,248,248)"

let ctx = canvas.getContext('2d')
ctx.fillStyle = 'rgb(248,248,248)'
ctx.fillRect(0, 0, canvas.width, canvas.height)
let painting = false
let last

ctx.fillStyle = "black"
ctx.strokStyle = "black"
ctx.lineWidth = 10
ctx.lineCap = 'round'
ctx.lineJoin = "round"


let range = document.getElementById('range')
let eraserBtn = document.getElementById('eraser')
let clearBtn = document.getElementById('clear')
let saveBtn = document.getElementById('save')
let undoBtn = document.getElementById('undo')
let aColorBtn = document.getElementsByClassName("color")
let activeColor = 'black'

let rainbow = document.getElementById('rainbow')
let isRainbow = false

getColor()


let rangeLast
let colorLast

let getRange = function () {
  rangeLast = range.value
}
let setStyle = function () {
  range.value = rangeLast
  ctx.lineWidth = rangeLast
  ctx.strokeStyle = activeColor
}


// 彩虹笔
rainbow.onclick = function () {
  getRange()
  console.log(rangeLast)
  console.log(isRainbow)
  ctx.lineWidth=10
  if (isRainbow === false) {
    if (isEraser === false) {
      isRainbow = true
      rainbow.classList.add('rainbowA')
      
    } else {
      isEraser = false
      isRainbow = true
      rainbow.classList.add('rainbowA')
      eraserBtn.classList.remove('eraserA')
    }
  } else {
    isRainbow = false
    rainbow.classList.remove('rainbowA')
    setStyle()
    
  }
}

// 调整笔刷粗细
range.onchange = function () {
  if (isRainbow === false) {
    ctx.lineWidth = this.value
  }
  
}
// 画笔颜色修改
let colors = Array.from(aColorBtn)

for (let i = 0; i < colors.length; i++) {
  colors[i].style.backgroundColor = colors[i].id.slice(0, -3)
}

let activeDom = document.getElementsByClassName("active")

function getColor() {
  for (let i = 0; i < aColorBtn.length; i++) {
    aColorBtn[i].onclick = function () {
      activeDom[0].classList.remove("active")
      this.classList.add("active")
      for (let i = 0; i < aColorBtn.length; i++) {
        activeColor = this.style.backgroundColor
        ctx.fillStyle = activeColor
        ctx.strokeStyle = activeColor
      }
      if (isRainbow) {
        colorLast = activeColor
      }
      if (isEraser) {
        isEraser = false
        eraserBtn.classList.remove('eraserA')
        setStyle()
        
      }
    }
  }
}

// 橡皮擦功能
let isEraser = false

eraserBtn.onclick = function () {
  console.log(isEraser)
  if (isEraser === false) {
    if (isRainbow === true) {
      isRainbow = false
      rainbow.classList.remove('rainbowA')
    }
    setStyle()
    
    isEraser = true
    ctx.strokeStyle = 'rgb(248,248,248)'
    eraserBtn.classList.add('eraserA')
    
  } else {
    isEraser = false
    setStyle()
    eraserBtn.classList.remove('eraserA')
    
  }
}

// 清空画布功能
clearBtn.onclick = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

// 将画布保存为图片
saveBtn.onclick = function () {
  let imgUrl = canvas.toDataURL("image/png")
  let saveA = document.createElement("a")
  document.body.appendChild(saveA)
  saveA.href = imgUrl
  saveA.download = "canvas" + (new Date).getTime()
  saveA.target = "_blank"
  saveA.click()
}

// 撤销
let historyData = []

function saveData(data) {
  (historyData.length === 20) && (historyData.shift()) // 上限为储存10步，太多了怕挂掉
  historyData.push(data)
}

undoBtn.onclick = function () {
  if (historyData.length < 1) {
    return false
  }
  ctx.putImageData(historyData[historyData.length - 1], 0, 0)
  historyData.pop()
}

let hue = 0
let direction = true

function drawLine(x1, y1, x2, y2) {
  
  if (isRainbow) {
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`
    if (hue >= 360) {
      hue = 0
    }
    hue += 0.5
    //		控制笔触大小
    if (ctx.lineWidth > 50 || ctx.lineWidth < 10) {
      direction = !direction
    }
    if (direction) {
      ctx.lineWidth++
      
    } else {
      ctx.lineWidth--
    }
    
  }
  
  ctx.beginPath()
  ctx.moveTo(x1 + 0.5, y1)
  ctx.lineTo(x2 + 0.5, y2)
  ctx.closePath()
  ctx.stroke()
}


let isTouchDevice = 'ontouchstart' in document.documentElement
if (isTouchDevice) {
  canvas.ontouchstart = (e) => {
    this.firstDot = ctx.getImageData(0, 0, canvas.width, canvas.height)
    saveData(this.firstDot)
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    last = [x, y]
  }
  canvas.ontouchmove = (e) => {
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    drawLine(last[0], last[1], x, y)
    last = [x, y]
  }
}

canvas.onmousedown = (e) => {
  this.firstDot = ctx.getImageData(0, 0, canvas.width, canvas.height)
  saveData(this.firstDot)
  painting = true
  last = [e.clientX, e.clientY]
}

canvas.onmousemove = (e) => {
  
  if (painting === true) {
    drawLine(last[0], last[1], e.clientX, e.clientY)
    last = [e.clientX, e.clientY]
  }
}

canvas.onmouseup = () => {
  painting = false
}


// 获取鼠标在某个元素上的位置
function getMousePos (ele) {
  let mouse = {x: null, y: null}
  mouse.addEventListener('mousemove', function (e) {
    mouse.x = e.pageX - ele.offsetLeft
    mouse.y = e.pageY - ele.offsetTop
  })
  return mouse
}

// 根据选择起选择元素
function $ (selector) {
  return document.querySelectorAll(selector)
}

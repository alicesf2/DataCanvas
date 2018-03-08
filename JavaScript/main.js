var defaultBG = document.getElementById("defaultPicture"),
    stack = document.getElementById("stackAnimation"),
    stack_input_group = document.getElementById("stackInputs"),
    linkedList = document.getElementById("linkedListAnimation"),
    queue = document.getElementById("queueAnimation"),
    queue_input_group = document.getElementById("queueInputs"),
    stack_button = document.getElementById("stackButton"),
    linkedList_button = document.getElementById("linkedListButton"),
    queue_button = document.getElementById("queueButton"),
    container = document.getElementById("container");

var thingsToHide = [stack, defaultBG, stack_input_group, linkedList, queue, queue_input_group];
var thingsToClear = [stack];

function clear() {
  for (var i = 0; i < thingsToHide.length; i++) {
    thingsToHide[i].style.display = "none";
  }
}

stack_button.onclick = () => {
  clear();
  stack_input_group.style.display = "flex";
  stack.style.display = "inline-flex";
  // functions below are defined in stack.js
  clearStack();
  drawStack();
}

linkedList_button.onclick = () => {
  clear();
  linkedList.style.display = "inline-flex";
}

queue_button.onclick = () => {
  clear();
  queue_input_group.style.display = "flex";
  queue.style.display = "inline-flex";
  // functions below are defined in queue.js
  clearQueue();
  drawQueue();
}

const durations = {
  focus: 25,
  shortbreak: 5,
  longbreak: 15,
};

let currentMode = "focus";
let time = durations[currentMode] * 60;
let interval = null;
let session = 0;
let dummySession = 4;
let inputElementValue = document.getElementById("input-box").value;

displayTime();

function switchTo(mode, autostart = false) {
  clearInterval(interval);
  interval = null;

  document.getElementById("focus-display").style.display = "none";
  document.getElementById("shortbreak-display").style.display = "none";
  document.getElementById("longbreak-display").style.display = "none";

  document.getElementById(mode + "-display").style.display = "block";

  currentMode = mode;
  time = durations[mode] * 60;

  displayTime();
  if (autostart) startTimer();
}

function startTimer() {
  if (inputElementValue === "") return;
  if (interval) return;
  interval = setInterval(updateTimer, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  clearInterval(interval);
  interval = null;

  time = durations[currentMode] * 60;
  session = 0;
  dummySession = 4;
  displayTime();
}

function updateTimer() {
  if (time <= 0) {
    clearInterval(interval);
    interval = null;

    if (currentMode === "focus") {
      session++;
      if (session === dummySession) {
        // check AFTER increment
        session = 0;
        switchTo("longbreak", true);
      } else {
        switchTo("shortbreak", true);
      }
    } else if (time <= 0 && currentMode === "longbreak") {
      document.getElementById("session-status").innerHTML = "Session Over!";
      return;
    } else if (currentMode === "shortbreak") {
      switchTo("focus", true);
    } else if (currentMode === "longbreak") {
      session = 0;
      switchTo("focus", true);
    }

    return;
  }
  time--;
  displayTime();
}

function displayTime() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds >= 10) {
    document.getElementById(currentMode + "-display").innerHTML =
      `${minutes}:${seconds}`;
  } else {
    document.getElementById(currentMode + "-display").innerHTML =
      `${minutes}:${"0" + seconds}`;
  }
}

function addTask() {
  inputElementValue = document.getElementById("input-box").value;

  let taskList = document.getElementById("task-list");

  if (inputElementValue === "") return;

  let listItem = document.createElement("li");
  listItem.className = "list-item";
  listItem.textContent = inputElementValue;

  let openSessionCtrl = document.createElement("button");
  openSessionCtrl.className = "session-ctrl-btn";
  openSessionCtrl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="5" r="1.5"/>
  <circle cx="12" cy="12" r="1.5"/>
  <circle cx="12" cy="19" r="1.5"/>
</svg>
`;

  openSessionCtrl.addEventListener("click", function () {
    if (document.querySelector(".task-controls").style.display === "none") {
      document.querySelector(".task-controls").style.display = "flex";
    } else {
      document.querySelector(".task-controls").style.display = "none";
    }
  });

  let addButton = document.createElement("button");
  addButton.className = "add-btn";
  addButton.textContent = "+";

  addButton.addEventListener("click", function () {
    dummySession++;
    sessionSpan.textContent = dummySession;
  });

  let sessionSpan = document.createElement("span");
  sessionSpan.className = "task-sessions";
  sessionSpan.textContent = dummySession;

  let minusButton = document.createElement("button");
  minusButton.className = "minus-btn";
  minusButton.textContent = "-";

  minusButton.addEventListener("click", function () {
    if (dummySession === 1) return;
    dummySession--;

    sessionSpan.textContent = dummySession;
  });

  let deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="3 6 5 6 21 6"/>
  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
  <path d="M10 11v6"/>
  <path d="M14 11v6"/>
  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
</svg>
`;

  deleteButton.addEventListener("click", function () {
    clearInterval(interval);
    interval = null;

    session = 0;
    dummySession = 4;
    resetTimer();

    taskList.removeChild(listItem);
  });

  let controlsDiv = document.createElement("div");
  controlsDiv.className = "task-controls";

  let sessionControlDiv = document.createElement("div");
  sessionControlDiv.className = "session-ctrl";

  sessionControlDiv.appendChild(addButton);
  sessionControlDiv.appendChild(sessionSpan);
  sessionControlDiv.appendChild(minusButton);

  controlsDiv.appendChild(sessionControlDiv);
  controlsDiv.appendChild(deleteButton);

  listItem.appendChild(openSessionCtrl);
  listItem.appendChild(controlsDiv);

  taskList.appendChild(listItem);

  document.getElementById("input-box").value = "";
}

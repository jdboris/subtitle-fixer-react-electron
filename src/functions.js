import { Time, scaleLinear, CustomElement } from "./utilities";

//alert( ( typeof process !== 'undefined' ) );

// Five minutes
const MILLISECONDS_PER_PAGE = 5 * 60 * 1000;
// NOTE: Browsers don't support more columns
const COLUMN_LIMIT = 1000;

let fs = null;

// If running with node webkit
if (typeof process !== "undefined") {
  fs = require("fs");
}

let filePath = "";
let subtitles = [];

let timeInputs = document.querySelectorAll(".time-inputs input");

for (let i = 0; i < timeInputs.length; i++) {
  let input = timeInputs[i];
  input.onkeydown = event => {
    input.oldValue = input.value;
  };

  input.oninput = event => {
    if (input.checkValidity() == false) {
      input.value = input.oldValue;
      input.classList.remove("invalid");
      setTimeout(() => {
        input.classList.add("invalid");
      }, 1);
    } else if (input.value.length >= input.maxLength) {
      // Cut off leading zeros when necessary
      if (input.value.length > input.maxLength) input.value = +input.value;

      if (i < timeInputs.length - 1) {
        timeInputs[i + 1].focus();
      }
    }
  };

  input.onfocus = event => {
    input.select();
  };

  input.onblur = event => {
    if (input.value.length < input.maxLength) {
      input.value = input.value.padStart(input.maxLength, "0");
    }
  };
}

function loadFile(specificFilePath = "") {
  let buffer = "";

  if (specificFilePath == "") {
    // Hold the name here temporarily, in case the fetch fails
    buffer = document.getElementById("file-name").value;
  } else {
    buffer = specificFilePath;
  }

  //buffer = "C:\\Users\\Joe\\Source\\Repos\\subtitle-fixer\\Game of Thrones S07E06.srt";
  if (fs == null) {
    console.log("Note: filesystem module (fs) not found.");
    // Cut off the path, before the file name
    buffer = buffer.split(/(\\|\/)/g).pop();
    fetch(buffer)
      .then(response => {
        return response.text();
      })
      .then(text => {
        callback(text, buffer);
      });
  } else {
    fs.readFile(buffer, "utf8", (err, text) => {
      if (err) throw err;
      callback(text, buffer);
    });
  }

  function callback(text, buffer) {
    filePath = buffer;

    subtitles = srtToSubtitles(text);

    if (subtitles.length <= 0) {
      console.error("No subtitles in file.");
    } else {
      let subtitle = subtitles[0];

      let inputs = document.querySelectorAll(
        "#subtitle-start-form .time-inputs input"
      );
      loadTimeIntoInputs(inputs, subtitle.start);
      inputs = document.querySelectorAll(
        "#talking-start-form .time-inputs input"
      );
      loadTimeIntoInputs(inputs, subtitle.start);

      inputs[0].focus();

      subtitle = subtitles[subtitles.length - 1];

      inputs = document.querySelectorAll(
        "#subtitle-end-form .time-inputs input"
      );
      loadTimeIntoInputs(inputs, subtitle.end);
      inputs = document.querySelectorAll(
        "#talking-end-form .time-inputs input"
      );
      loadTimeIntoInputs(inputs, subtitle.end);

      function loadTimeIntoInputs(inputs, time) {
        inputs[0].value = ("" + time.getUTCHours()).padStart(2, "0");
        inputs[1].value = ("" + time.getUTCMinutes()).padStart(2, "0");
        inputs[2].value = ("" + time.getUTCSeconds()).padStart(2, "0");
        inputs[3].value = ("" + time.getUTCMilliseconds()).padStart(3, "0");
      }
    }

    let form = document.querySelector("#first-subtitle-form");
    loadSubtitlesToForm(form, COLUMN_LIMIT, 1);

    let lastSubtitle = subtitles[subtitles.length - 1];
    let totalPages = parseInt(lastSubtitle.end / MILLISECONDS_PER_PAGE) + 1;
    form = document.querySelector("#last-subtitle-form");
    loadSubtitlesToForm(form, COLUMN_LIMIT, totalPages);

    document.body.classList.add("file-selected");
  }
}

function loadSubtitlesToForm(form, columnCount, page) {
  let totalPages =
    parseInt(subtitles[subtitles.length - 1].end / MILLISECONDS_PER_PAGE) + 1;

  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  form.dataset.subtitlePage = page;

  let rangeStart = (page - 1) * MILLISECONDS_PER_PAGE;
  let rangeEnd = rangeStart + MILLISECONDS_PER_PAGE;

  let subtitlesDiv = form.querySelector(".subtitles");
  let timePeriodDiv = form.querySelector(".subtitles-time-period");
  let chosenSubtitleInput = form.getElementsByTagName("input")[0];

  subtitlesDiv.style.gridTemplateColumns = `repeat(${columnCount}, auto)`;
  timePeriodDiv.dataset.subtitleTimePeriod = `(${dateToTimeString(
    new Time(rangeStart)
  )}-${dateToTimeString(new Time(rangeEnd))})`;

  // Empty the subtitles element first
  subtitlesDiv.innerHTML = "";

  let start;
  for (start = 0; start < subtitles.length; start++) {
    if (subtitles[start].start > rangeStart) {
      break;
    }
  }

  for (let i = start; i < subtitles.length; i++) {
    let subtitle = subtitles[i];

    if (subtitle.start > rangeEnd) break;

    let startColumn = parseInt(
      ((subtitle.start.getTime() - rangeStart) / (rangeEnd - rangeStart)) *
        columnCount
    );
    let endColumn = parseInt(
      ((subtitle.end.getTime() - rangeStart) / (rangeEnd - rangeStart)) *
        columnCount
    );

    let element = new CustomElement(
      `<div class="subtitle" style="grid-column: ${startColumn} / ${endColumn}"></div>`
    );
    element.dataset.timePeriod = dateToSrtTime(subtitle.start);
    element.dataset.text = subtitle.text;
    element.onclick = event => {
      chosenSubtitleInput.value = i;

      // NOTE: Must call onsubmit because calling submit() does not call the form's submit event handler(s)
      form.onsubmit(event);
    };
    subtitlesDiv.appendChild(element);
  }
}

function nextSubtitlePage(form) {
  loadSubtitlesToForm(
    form,
    COLUMN_LIMIT,
    parseInt(form.dataset.subtitlePage) + 1
  );
}

function previousSubtitlePage(form) {
  loadSubtitlesToForm(
    form,
    COLUMN_LIMIT,
    parseInt(form.dataset.subtitlePage) - 1
  );
}

function setFirstSubtitle(event) {
  let firstSubtitleForm = document.getElementById("first-subtitle-form");
  let chosenSubtitleInput = firstSubtitleForm.getElementsByTagName("input")[0];
  let subtitleStartForm = document.getElementById("subtitle-start-form");
  let subtitleStartInputs = subtitleStartForm.getElementsByTagName("input");
  let talkingTimeInputs = document.querySelectorAll(
    "#talking-start-form .time-inputs input"
  );

  let newFirstSubtitle = subtitles[chosenSubtitleInput.value];
  let buffer = subtitles[0];

  // Delete every subtitle before the new first subtitle
  while (buffer != newFirstSubtitle) {
    subtitles.shift();
    buffer = subtitles[0];
  }

  subtitleStartInputs[0].value = talkingTimeInputs[0].value;
  subtitleStartInputs[1].value = talkingTimeInputs[1].value;
  subtitleStartInputs[2].value = talkingTimeInputs[2].value;
  subtitleStartInputs[3].value = talkingTimeInputs[3].value;

  // NOTE: Must call onsubmit because calling submit() does not call the form's submit event handler(s)
  subtitleStartForm.onsubmit(event);
}

function setLastSubtitle(event) {
  let lastSubtitleForm = document.getElementById("last-subtitle-form");
  let chosenSubtitleInput = lastSubtitleForm.getElementsByTagName("input")[0];
  let subtitleEndForm = document.getElementById("subtitle-end-form");
  let subtitleEndInputs = subtitleEndForm.getElementsByTagName("input");
  let talkingTimeInputs = document.querySelectorAll(
    "#talking-end-form .time-inputs input"
  );

  let newLastSubtitle = subtitles[chosenSubtitleInput.value];
  let buffer = subtitles[subtitles.length - 1];

  // Delete every subtitle after the new last subtitle
  while (buffer != newLastSubtitle) {
    subtitles.pop();
    buffer = subtitles[subtitles.length - 1];
  }

  subtitleEndInputs[0].value = talkingTimeInputs[0].value;
  subtitleEndInputs[1].value = talkingTimeInputs[1].value;
  subtitleEndInputs[2].value = talkingTimeInputs[2].value;
  subtitleEndInputs[3].value = talkingTimeInputs[3].value;

  // NOTE: Must call onsubmit because calling submit() does not call the form's submit event handler(s)
  subtitleEndForm.onsubmit(event);
}

// Offsets the subtitles to align the first subtitle with the given time
function setNewFileStart() {
  let form = document.getElementById("subtitle-start-form");
  let inputs = form.getElementsByTagName("input");

  let newStart = new Time(
    inputs[0].value,
    inputs[1].value,
    inputs[2].value,
    inputs[3].value
  );

  let difference = newStart - subtitles[0].start;

  for (let subtitle of subtitles) {
    subtitle.start = new Time(subtitle.start.getTime() + difference);
    subtitle.end = new Time(subtitle.end.getTime() + difference);
  }

  saveFile();
}

// Scales the subtitles to align the end of the last subtitle with the given time, without moving the first subtitle
function setNewFileEnd() {
  let form = document.getElementById("subtitle-end-form");
  let inputs = form.getElementsByTagName("input");

  let oldEnd = subtitles[subtitles.length - 1].end;
  let newEnd = new Time(
    inputs[0].value,
    inputs[1].value,
    inputs[2].value,
    inputs[3].value
  );

  for (let subtitle of subtitles) {
    subtitle.start = new Time(
      scaleLinear(
        subtitle.start,
        subtitles[0].start,
        subtitles[0].start,
        oldEnd,
        newEnd
      )
    );
    subtitle.end = new Time(
      scaleLinear(
        subtitle.end,
        subtitles[0].start,
        subtitles[0].start,
        oldEnd,
        newEnd
      )
    );
  }

  saveFile();
}

function offsetFile() {
  let offset = parseInt(document.getElementById("offset").value.trim()) || 0;
  for (let subtitle of subtitles) {
    subtitle.start.setMilliseconds(subtitle.start.getMilliseconds() + offset);
    subtitle.end.setMilliseconds(subtitle.end.getMilliseconds() + offset);
  }

  document.getElementById("offset").value = "";

  saveFile();
}

export function saveFile() {
  let text = subtitlesToSrt(subtitles);

  if (fs == null) {
    console.log("Note: filesystem module (fs) not found.");
    downloadAsSrtFile(text, document.getElementById("file-name").value);
  } else {
    fs.writeFile(filePath, text, function(err) {
      if (err) {
        return console.error(err);
      }

      loadFile(filePath);
    });
  }
}

function srtToSubtitles(text) {
  let subtitles = [];
  let lines = text.split(/\r\n|\r|\n/);

  for (let i = 1; i < lines.length; i++) {
    // NOTE: Must start i at 1 and decrement here to work with the while loop
    i--;

    let subtitle = {
      start: srtTimeToDate(lines[i + 1].split("-->")[0]),
      end: srtTimeToDate(lines[i + 1].split("-->")[1]),
      text: lines[i + 2]
    };
    subtitles.push(subtitle);

    i += 3;

    // While the line at i is not an index
    // NOTE: This condition will likely correctly find the index 99.99% of the time,
    //       but subtitle text containing only a number followed by what looks like a subtitle time period may break it
    while (
      i < lines.length &&
      !(
        +lines[i].trim() == lines[i] &&
        /(\d:\d).*(-->).*(\d:\d)/.test(lines[i + 1])
      )
    ) {
      subtitle.text += "\r\n" + lines[i];
      i++;
    }
  }

  return subtitles;
}

function srtTimeToDate(timeString) {
  let parts = timeString.split(":");
  let buffer = parts[2].split(",");
  parts[2] = buffer[0];
  parts[3] = buffer[1];

  let dateTime = new Time(parts[0], parts[1], parts[2], parts[3]);

  return dateTime;
}

function dateToSrtTime(dateTime) {
  let parts = [];
  parts[0] = ("" + dateTime.getUTCHours()).padStart(2, "0");
  parts[1] = ("" + dateTime.getUTCMinutes()).padStart(2, "0");
  parts[2] = ("" + dateTime.getUTCSeconds()).padStart(2, "0");
  parts[3] = ("" + dateTime.getUTCMilliseconds()).padStart(3, "0");
  let timeString = `${parts[0]}:${parts[1]}:${parts[2]},${parts[3]}`;
  return timeString;
}

function subtitlesToSrt(subtitles) {
  let text = "";
  let i = 0;

  // NOTE: Do NOT rely on i being the expected valid index/key (i.e. subtitles[i])
  for (let subtitle of subtitles) {
    text += i + 1 + "\r\n";
    text += `${dateToSrtTime(subtitle.start)} --> ${dateToSrtTime(
      subtitle.end
    )}\r\n`;
    text += subtitle.text + "\r\n";
    //text += "\r\n";
    i++;
  }

  return text;
}

function dateToTimeString(dateTime) {
  let parts = [];
  parts[0] = ("" + dateTime.getUTCHours()).padStart(2, "0");
  parts[1] = ("" + dateTime.getUTCMinutes()).padStart(2, "0");
  parts[2] = ("" + dateTime.getUTCSeconds()).padStart(2, "0");
  let timeString = `${parts[0]}:${parts[1]}:${parts[2]}`;
  return timeString;
}

function downloadAsSrtFile(text, fileName) {
  let blob = new Blob([text], {
    type: "text/plain"
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;

  a.download = fileName.split(/(\\|\/)/g).pop();
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

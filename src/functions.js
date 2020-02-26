import { Time } from "./utilities";
import { Subtitle } from "./models/subtitle";
const fs = window.require("electron").remote.require("fs");

export function loadFile(filePath = "") {
  let subtitles = [];

  fs.readFile(filePath, "utf8", (err, text) => {
    if (err) throw err;
    callback(text);
  });

  function callback(text) {
    subtitles = srtToSubtitles(text);

    // if (subtitles.length <= 0) {
    //   console.error("No subtitles in file.");
    // } else {
    //   let subtitle = subtitles[0];

    //   let inputs = document.querySelectorAll(
    //     "#subtitle-start-form .time-inputs input"
    //   );
    //   loadTimeIntoInputs(inputs, subtitle.start);
    //   inputs = document.querySelectorAll(
    //     "#talking-start-form .time-inputs input"
    //   );
    //   loadTimeIntoInputs(inputs, subtitle.start);

    //   inputs[0].focus();

    //   subtitle = subtitles[subtitles.length - 1];

    //   inputs = document.querySelectorAll(
    //     "#subtitle-end-form .time-inputs input"
    //   );
    //   loadTimeIntoInputs(inputs, subtitle.end);
    //   inputs = document.querySelectorAll(
    //     "#talking-end-form .time-inputs input"
    //   );
    //   loadTimeIntoInputs(inputs, subtitle.end);

    //   function loadTimeIntoInputs(inputs, time) {
    //     inputs[0].value = ("" + time.getUTCHours()).padStart(2, "0");
    //     inputs[1].value = ("" + time.getUTCMinutes()).padStart(2, "0");
    //     inputs[2].value = ("" + time.getUTCSeconds()).padStart(2, "0");
    //     inputs[3].value = ("" + time.getUTCMilliseconds()).padStart(3, "0");
    //   }
    // }

    // let form = document.querySelector("#first-subtitle-form");
    // loadSubtitlesToForm(form, COLUMN_LIMIT, 1);

    // let lastSubtitle = subtitles[subtitles.length - 1];
    // let totalPages = parseInt(lastSubtitle.end / MILLISECONDS_PER_PAGE) + 1;
    // form = document.querySelector("#last-subtitle-form");
    // loadSubtitlesToForm(form, COLUMN_LIMIT, totalPages);

    // document.body.classList.add("file-selected");
  }
}

function srtToSubtitles(fileText) {
  let subtitles = [];

  // Extract the times and texts from the file text
  let timeStrings = fileText.match(/(?:\d+:\d+:\d+,\d+ --> \d+:\d+:\d+,\d+)/g);
  let subtitleTexts = fileText.split(
    /(?:\d+\s+\d+:\d+:\d+,\d+ --> \d+:\d+:\d+,\d+)/g
  );

  // Remove the rogue "" element at the start
  subtitleTexts.shift();

  for (let i = 0; i < subtitleTexts.length; i++) {
    subtitleTexts[i] = subtitleTexts[i].trim();

    subtitles.push(new Subtitle(timeStrings[i], subtitleTexts[i]));
  }

  return subtitles;
}

export function srtTimeToDate(timeString) {
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

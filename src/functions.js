import { Time } from "./utilities";
import { Subtitle } from "./models/subtitle";
const fs = window.require("electron").remote.require("fs");

export function loadFile(filePath, callback) {
  fs.readFile(filePath, "utf8", (err, fileText) => {
    if (err) throw err;

    let subtitles = srtToSubtitles(fileText);
    if (subtitles.length === 0) {
      console.error("No subtitles in file.");
    } else {
      callback(subtitles);
    }
  });
}

export function saveFile(subtitles, filePath, callback) {
  let text = subtitlesToSrt(subtitles);

  fs.writeFile(filePath, text, function(err) {
    if (err) {
      return console.error(err);
    }

    loadFile(filePath, callback);
  });
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

export function dateToSrtTime(dateTime) {
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

  for (let i = 0; i < subtitles.length; i++) {
    let subtitle = subtitles[i];
    text += i + 1 + "\r\n";
    text += `${dateToSrtTime(subtitle.start)} --> ${dateToSrtTime(
      subtitle.end
    )}\r\n`;
    text += subtitle.text + "\r\n";
    text += "\r\n";
  }

  return text;
}

export function dateToTimeString(dateTime) {
  let parts = [];
  parts[0] = ("" + dateTime.getUTCHours()).padStart(2, "0");
  parts[1] = ("" + dateTime.getUTCMinutes()).padStart(2, "0");
  parts[2] = ("" + dateTime.getUTCSeconds()).padStart(2, "0");
  let timeString = `${parts[0]}:${parts[1]}:${parts[2]}`;
  return timeString;
}

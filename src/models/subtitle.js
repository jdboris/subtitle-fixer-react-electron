import { srtTimeToDate } from "../functions";

export class Subtitle {
  constructor(srtTimeString, text) {
    this.start = srtTimeToDate(srtTimeString.split("-->")[0]);
    this.end = srtTimeToDate(srtTimeString.split("-->")[1]);
    this.text = text;
  }
}

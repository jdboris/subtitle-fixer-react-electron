import React, { Component } from "react";
import TimeForm from "./time-form";
import { Time, scaleLinear } from "../utilities";
import { saveFile } from "../functions";

class SetSubtitleStartForm extends TimeForm {
  state = {};

  submitHandler = event => {
    event.preventDefault();
    let form = document.getElementById("subtitle-start-form");
    let inputs = form.getElementsByTagName("input");

    let newStart = new Time(
      inputs[0].value,
      inputs[1].value,
      inputs[2].value,
      inputs[3].value
    );

    let difference = newStart - this.props.subtitles[0].start;

    for (let subtitle of this.props.subtitles) {
      subtitle.start = new Time(subtitle.start.getTime() + difference);
      subtitle.end = new Time(subtitle.end.getTime() + difference);
    }

    saveFile();
  };

  render() {
    return (
      <TimeForm
        id="talking-start-form"
        label="When should the first subtitle start?"
        onSubmit={this.submitHandler}
      />
    );
  }
}

export default SetSubtitleStartForm;

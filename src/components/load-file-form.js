import React, { Component } from "react";
import { loadFile } from "../functions";

class LoadFileForm extends Component {
  state = {};

  handleChange = event => {
    let subtitles = [];
    // NOTE: Electron adds a path property to the files objects of the input
    loadFile(event.target.files[0].path, subtitles => {
      this.props.initializeSubtitles(subtitles);

      let first = subtitles[0];
      this.props.setTalkingStart(first.start);

      let last = subtitles[subtitles.length - 1];
      this.props.setTalkingEnd(last.end);

      //   let inputs = document.querySelectorAll(
      //     "#subtitle-start-form .time-inputs input"
      //   );
      //   loadTimeIntoInputs(inputs, first.start);
      //   inputs = document.querySelectorAll(
      //     "#talking-start-form .time-inputs input"
      //   );
      //   loadTimeIntoInputs(inputs, first.start);

      //   inputs[0].focus();

      //   let last = subtitles[subtitles.length - 1];

      //   inputs = document.querySelectorAll(
      //     "#subtitle-end-form .time-inputs input"
      //   );
      //   loadTimeIntoInputs(inputs, last.end);
      //   inputs = document.querySelectorAll(
      //     "#talking-end-form .time-inputs input"
      //   );
      //   loadTimeIntoInputs(inputs, last.end);

      //   function loadTimeIntoInputs(inputs, time) {
      //     inputs[0].value = ("" + time.getUTCHours()).padStart(2, "0");
      //     inputs[1].value = ("" + time.getUTCMinutes()).padStart(2, "0");
      //     inputs[2].value = ("" + time.getUTCSeconds()).padStart(2, "0");
      //     inputs[3].value = ("" + time.getUTCMilliseconds()).padStart(3, "0");
      //   }

      //   let form = document.querySelector("#first-subtitle-form");
      //   loadSubtitlesToForm(form, COLUMN_LIMIT, 1);

      //   let lastSubtitle = subtitles[subtitles.length - 1];
      //   let totalPages = parseInt(lastSubtitle.end / MILLISECONDS_PER_PAGE) + 1;
      //   form = document.querySelector("#last-subtitle-form");
      //   loadSubtitlesToForm(form, COLUMN_LIMIT, totalPages);

      //   document.body.classList.add("file-selected");
    });
  };

  render() {
    return (
      <form>
        <input type="file" onChange={this.handleChange} />
      </form>
    );
  }
}

export default LoadFileForm;

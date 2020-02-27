import React, { Component } from "react";
import { loadFile } from "../functions";

class SrtFileInput extends Component {
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
    });
  };

  render() {
    return <input type="file" onChange={this.handleChange} />;
  }
}

export default SrtFileInput;

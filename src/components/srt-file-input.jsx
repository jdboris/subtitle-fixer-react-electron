import React, { Component } from "react";
import { loadFile } from "../functions";
import { Time } from "../utilities";

class SrtFileInput extends Component {
  state = {};

  handleChange = event => {
    let { files } = event.target;

    if (files.length > 0) {
      // NOTE: Electron adds a path property to the files objects of the input
      loadFile(files[0].path, subtitles => {
        this.props.initializeSubtitles(subtitles);
        this.props.setFilePath(files[0].path);

        let first = subtitles[0];
        this.props.setTalkingStart(new Time(first.start));

        let last = subtitles[subtitles.length - 1];
        this.props.setTalkingEnd(new Time(last.end));
      });
    }
  };

  render() {
    return <input type="file" onChange={this.handleChange} />;
  }
}

export default SrtFileInput;

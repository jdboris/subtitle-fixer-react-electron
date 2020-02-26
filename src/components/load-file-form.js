import React, { Component } from "react";
import { loadFile } from "../functions";

class LoadFileForm extends Component {
  state = {};

  handleChange = event => {
    let subtitles = [];
    // NOTE: Electron adds a path property to the files objects of the input
    loadFile(event.target.files[0].path);
    this.props.initializeSubtitles(subtitles);
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

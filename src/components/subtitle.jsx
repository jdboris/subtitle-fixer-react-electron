import React, { Component } from "react";
import { dateToSrtTime } from "../functions";

class Subtitle extends Component {
  state = {};
  render() {
    return (
      <div
        className="subtitle has-tooltip"
        style={this.props.style}
        onClick={this.props.onClick}
      >
        <div className="tooltip">
          <div className="tooltip-time">
            {dateToSrtTime(this.props.subtitle.start)}
          </div>
          {this.props.subtitle.text}
        </div>
      </div>
    );
  }
}

export default Subtitle;

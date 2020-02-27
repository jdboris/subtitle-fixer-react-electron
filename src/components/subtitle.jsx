import React, { Component } from "react";
import { dateToSrtTime } from "../functions";

class Subtitle extends Component {
  state = {};
  render() {
    return (
      <div
        className="subtitle"
        style={this.props.style}
        //timePeriod={dateToSrtTime(this.props.subtitle.start)}
        //text={this.props.subtitle.text}
        data-text={this.props.subtitle.text}
        data-time-period={dateToSrtTime(this.props.subtitle.start)}
      ></div>
    );
  }
}

export default Subtitle;

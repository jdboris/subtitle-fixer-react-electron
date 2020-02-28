import React, { Component } from "react";
import Subtitle from "./subtitle";
import { dateToTimeString } from "../functions";
import { Time } from "../utilities";

class SubtitlePicker extends Component {
  state = {
    pageNumber: this.props.defaultPageNumber,
    subtitles: this.props.subtitles
  };
  loadSubtitlePage = pageNumber => {};

  render() {
    let page = [];
    let pageNumber = 0;
    let rangeStart = 0;
    let rangeEnd = 0;
    let style = {};

    // Five minutes
    const millisecondsPerPage = 5 * 60 * 1000;
    // NOTE: Browsers don't support more columns
    const columnCount = 1000;

    let subtitles = this.props.subtitles;

    if (subtitles.length > 0) {
      let totalPages =
        parseInt(subtitles[subtitles.length - 1].end / millisecondsPerPage) + 1;

      pageNumber = this.state.pageNumber;

      if (pageNumber < 1) pageNumber = 1;
      if (pageNumber > totalPages) pageNumber = totalPages;

      rangeStart = (pageNumber - 1) * millisecondsPerPage;
      rangeEnd = rangeStart + millisecondsPerPage;

      style.gridTemplateColumns = `repeat(${columnCount}, auto)`;

      let start;
      for (start = 0; start < subtitles.length; start++) {
        if (subtitles[start].start > rangeStart) {
          break;
        }
      }

      for (let i = start; i < subtitles.length; i++) {
        let subtitle = subtitles[i];

        let startTime = subtitle.start.getTime();
        if (startTime > rangeEnd) break;

        let startColumn = parseInt(
          ((subtitle.start.getTime() - rangeStart) / (rangeEnd - rangeStart)) *
            columnCount
        );
        let endColumn = parseInt(
          ((subtitle.end.getTime() - rangeStart) / (rangeEnd - rangeStart)) *
            columnCount
        );

        let element = (
          <Subtitle
            key={page.length}
            style={{ gridColumn: `${startColumn} / ${endColumn}` }}
            subtitle={subtitle}
            onClick={event => {
              // TODO: Call a callback from the parent
              console.log(subtitle);
            }}
          />
        );
        page.push(element);
      }
    }

    return (
      <div className="subtitle-picker">
        <input type="hidden" />
        <label>{this.props.label}</label>

        <div className="subtitles-time-period-controls">
          <button
            type="button"
            onClick={() => {
              this.setState({ pageNumber: pageNumber - 1 });
            }}
          >
            &lt;
          </button>
          <div className="subtitles-time-period">
            {dateToTimeString(new Time(rangeStart))}-
            {dateToTimeString(new Time(rangeEnd))}
          </div>
          <button
            type="button"
            onClick={() => {
              this.setState({ pageNumber: pageNumber + 1 });
            }}
          >
            &gt;
          </button>
        </div>
        <div className="time-scale">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="subtitles" style={style}>
          {page}
        </div>
      </div>
    );
  }
}

export default SubtitlePicker;

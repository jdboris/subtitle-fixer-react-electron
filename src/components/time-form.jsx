import React, { Component } from "react";
import TimeInput from "./time-input";

class TimeForm extends Component {
  handleInput = (event, shouldContinue = false) => {
    let methodName =
      "setUTC" + event.target.name.replace(/^\w/, c => c.toUpperCase());
    this.props.time[methodName](event.target.value);

    this.props.setTime(this.props.time);

    if (shouldContinue) {
      const form = event.target.form;
      const index = [...form.elements].indexOf(event.target);
      if (index + 1 < form.elements.length) {
        form.elements[index + 1].focus();
      } else {
      }
    }
  };

  render() {
    return (
      <form id={this.props.id}>
        <div>
          <label htmlFor={this.props.id + "-start-hours"}>
            {this.props.label}
          </label>

          <div className="time-inputs">
            <TimeInput
              id={this.props.id + "-start-hours"}
              name="hours"
              max="99"
              onInput={this.handleInput}
            />
            :
            <TimeInput name="minutes" max="59" onInput={this.handleInput} />
            :
            <TimeInput name="seconds" max="59" onInput={this.handleInput} />
            .
            <TimeInput
              name="milliseconds"
              max="999"
              onInput={this.handleInput}
            />
          </div>
        </div>
      </form>
    );
  }
}

export default TimeForm;

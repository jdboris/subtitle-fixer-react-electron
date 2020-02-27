import React, { Component } from "react";

class TimeInput extends Component {
  state = { oldValue: "" };

  handleFocus = event => {
    let input = event.target;
    input.select();
  };

  handleBlur = event => {
    let input = event.target;
    if (input.value.length < input.maxLength) {
      input.value = input.value.padStart(input.maxLength, "0");
    }
  };

  handleKeyDown = event => {
    let input = event.target;
    this.setState({ oldValue: input.value });
  };

  handleInput = event => {
    let input = event.target;
    let shouldContinue = false;

    if (input.checkValidity() == false) {
      input.value = this.state.oldValue;
      input.classList.remove("invalid");
      // NOTE: Must be asynchronous to trigger the CSS animation
      setTimeout(() => {
        input.classList.add("invalid");
      }, 1);
    } else if (input.value.length >= input.maxLength) {
      // Cut off leading zeros when necessary
      if (input.value.length > input.maxLength) input.value = +input.value;

      shouldContinue = true;
    }

    this.props.onInput(event, shouldContinue);
  };

  render() {
    return (
      <input
        id={this.props.id}
        name={this.props.name}
        type="number"
        min="0"
        max={this.props.max}
        maxLength={this.props.max.length}
        placeholder={"0".repeat(this.props.max.length)}
        onInput={this.handleInput}
        onKeyDown={this.handleKeyDown}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        defaultValue={this.props.value ? this.props.value : ""}
      />
    );
  }
}

export default TimeInput;

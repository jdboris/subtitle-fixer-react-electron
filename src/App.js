import React from "react";
import { Time } from "./utilities";
import TimeForm from "./components/time-form";

class App extends React.Component {
  state = {
    subtitles: [],
    talkingStart: new Time(),
    talkingEnd: new Time(),
    subtitleStart: new Time(),
    subtitleEnd: new Time()
  };

  render() {
    return (
      <div className="App">
        <TimeForm
          id="talking-start-form"
          label="1. When does the talking start?"
          time={this.state.talkingStart}
          setTime={talkingStart => {
            this.setState({ talkingStart });
          }}
        />
        <TimeForm
          id="talking-end-form"
          label="2. When does the talking end?"
          time={this.state.talkingEnd}
          setTime={talkingEnd => {
            this.setState({ talkingEnd });
          }}
        />
      </div>
    );
  }
}

export default App;

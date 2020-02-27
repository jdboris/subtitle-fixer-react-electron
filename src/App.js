import React from "react";
import { Time } from "./utilities";
import TimeForm from "./components/time-form";
import LoadFileForm from "./components/load-file-form";

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
        <LoadFileForm
          initializeSubtitles={subtitles => {
            //console.log("initializing subtitles...", subtitles);
            this.setState({ subtitles });
          }}
          setTalkingStart={talkingStart => {
            console.log("SETTING START", talkingStart);
            this.setState({ talkingStart });
          }}
          setTalkingEnd={talkingEnd => {
            this.setState({ talkingEnd });
          }}
        />

        <TimeForm
          id="talking-start-form"
          label="1. When does the talking start?"
          time={this.state.talkingStart}
          setTime={talkingStart => {
            this.setState({ talkingStart });
          }}
        />
        {this.state.talkingStart.toUTCString()}
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

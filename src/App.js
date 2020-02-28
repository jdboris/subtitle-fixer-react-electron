import React from "react";
import { Time } from "./utilities";
import TimeForm from "./components/time-form";
import SrtFileInput from "./components/srt-file-input";
import SubtitlePicker from "./components/subtitle-picker";

class App extends React.Component {
  state = {
    subtitles: [],
    talkingStart: new Time(),
    talkingEnd: new Time(),
    subtitleStart: new Time(),
    subtitleEnd: new Time()
  };

  render() {
    let subtitleCorrectionInputs = null;

    if (this.state.subtitles.length > 0) {
      subtitleCorrectionInputs = (
        <div>
          <section className="talking-forms-section">
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
          </section>

          <SubtitlePicker
            subtitles={this.state.subtitles}
            defaultPageNumber={1}
            label="3. Select the first subtitle."
          />
          <SubtitlePicker
            subtitles={this.state.subtitles}
            defaultPageNumber={this.state.subtitles.length}
            label="4. Select the last subtitle."
          />
        </div>
      );
    }

    return (
      <div
        className={
          "app " + (this.state.subtitles.length > 0 ? "file-selected" : "")
        }
      >
        <SrtFileInput
          initializeSubtitles={subtitles => {
            this.setState({ subtitles });

            /*
            let form = document.querySelector("#first-subtitle-form");
            loadSubtitlesToForm(form, COLUMN_LIMIT, 1);

            let lastSubtitle = subtitles[subtitles.length - 1];
            let totalPages =
              parseInt(lastSubtitle.end / MILLISECONDS_PER_PAGE) + 1;
            form = document.querySelector("#last-subtitle-form");
            loadSubtitlesToForm(form, COLUMN_LIMIT, totalPages);

            document.body.classList.add("file-selected");
            */
          }}
          setTalkingStart={talkingStart => {
            this.setState({ talkingStart });
          }}
          setTalkingEnd={talkingEnd => {
            this.setState({ talkingEnd });
          }}
        />
        {subtitleCorrectionInputs}
      </div>
    );
  }
}

export default App;

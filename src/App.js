import React from "react";
import { Time, scaleLinear } from "./utilities";
import { saveFile } from "./functions";
import TimeForm from "./components/time-form";
import SrtFileInput from "./components/srt-file-input";
import SubtitlePicker from "./components/subtitle-picker";

class App extends React.Component {
  state = {
    subtitles: [],
    filePath: "",
    talkingStart: new Time(),
    talkingEnd: new Time()
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
            filePath={this.state.filePath}
            label="3. Select the first subtitle."
            handlePick={index => {
              let { subtitles } = this.state;
              let subtitle = subtitles[index];
              // Delete every subtitle before the new first subtitle
              subtitles.splice(0, index);

              let difference = this.state.talkingStart - subtitle.start;

              for (let subtitle of subtitles) {
                subtitle.start = new Time(
                  subtitle.start.getTime() + difference
                );
                subtitle.end = new Time(subtitle.end.getTime() + difference);
              }

              saveFile(subtitles, this.state.filePath, subtitles => {
                this.setState({ subtitles });

                let first = subtitles[0];
                this.setState({ talkingStart: new Time(first.start) });

                let last = subtitles[subtitles.length - 1];
                this.setState({ talkingEnd: new Time(last.end) });
              });
            }}
          />
          <SubtitlePicker
            subtitles={this.state.subtitles}
            defaultPageNumber={this.state.subtitles.length}
            filePath={this.state.filePath}
            label="4. Select the last subtitle."
            handlePick={index => {
              let { subtitles } = this.state;
              let oldEnd = subtitles[index].end;
              // Delete every subtitle after the new last subtitle
              subtitles.splice(index + 1);

              for (let subtitle of subtitles) {
                subtitle.start = new Time(
                  scaleLinear(
                    subtitle.start,
                    subtitles[0].start,
                    subtitles[0].start,
                    oldEnd,
                    this.state.talkingEnd
                  )
                );
                subtitle.end = new Time(
                  scaleLinear(
                    subtitle.end,
                    subtitles[0].start,
                    subtitles[0].start,
                    oldEnd,
                    this.state.talkingEnd
                  )
                );
              }

              saveFile(subtitles, this.state.filePath, subtitles => {
                this.setState({ subtitles });

                let first = subtitles[0];
                this.setState({ talkingStart: new Time(first.start) });

                let last = subtitles[subtitles.length - 1];
                this.setState({ talkingEnd: new Time(last.end) });
              });
            }}
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
          }}
          setFilePath={filePath => {
            this.setState({ filePath });
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

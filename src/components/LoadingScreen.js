import * as Tone from "tone";
import React, {useEffect, useState, useRef} from "react";

export function LoadingScreen(props) {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const progress = useRef(0);
    const progressCap = useRef(1000);

    const loadSamples = (sampleData) => {
        progressCap.current = sampleData.length;
        return sampleData.map((s) => {
            const buffer = new Tone.Buffer(s.path);
            const player = new Tone.Player(buffer, () => {
              progress.current += 1;
              console.log(`${progress.current}/${progressCap.current}`);
              if (progress.current == progressCap.current) setLoaded(true);
            });
            return player;
        });
    }

    useEffect(() => {
      fetch("composition.json")
        .then((res) => res.json())
        .then(
          (result) => {
            const players = loadSamples(result["samples"]);
            props.setup(result, players);
          },
          (error) => {
            console.log(error);
            setError(true);
          }
        );
    }, []);

    return (
      <>
      <div className="startModal">
        <p>
          {loaded ? (
              <a href="#" className="start" onClick={() => props.start()}>
                MASHANGOK
              </a>
          ) : error ? (
            `Error`
          ) : (
            ""
          )}
        </p>
      </div>
      {loaded ? (
        <div class="playButton"  onClick={() => props.start()}> </div>
      ) : ("")}
      </>
    );
  }

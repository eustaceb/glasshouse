import * as Tone from "tone";
import React, {useEffect, useState, useRef} from "react";
import { useLocalContext } from "../utils/ReactHelpers";

const images = [
  "images/bg.png",
  "images/common/percActive.png",
  "images/common/percHover.png",
  "images/navigation/arrowLeft.png",
  "images/navigation/arrowLeftHover.png",
  "images/navigation/arrowRight.png",
  "images/navigation/arrowRightHover.png",
  "images/navigation/lineRepeat.png",
  "images/navigation/markerLeft.png",
  "images/navigation/markerRight.png",
  "images/navigation/mute.png",
  "images/navigation/muteActive.png",
  "images/navigation/muteHover.png",
  "images/navigation/playbuttonHover.png",
  "images/navigation/playbuttonStatic.png",
  "images/section1/bass.png",
  "images/section1/bassActive.png",
  "images/section1/bassHover.png",
  "images/section1/clap.png",
  "images/section1/clapActive.png",
  "images/section1/clapHover.png",
  "images/section1/componentA.png",
  "images/section1/componentB.png",
  "images/section1/percSlider1.png",
  "images/section1/percSlider2.png",
  "images/section1/percSlider3.png",
  "images/section1/percSlider4.png",
  "images/section1/percSlider5.png",
  "images/section1/percSlider6.png",
  "images/section1/percSlider7.png",
  "images/section1/percSlider8.png",
  "images/section1/stringArp.png",
  "images/section1/stringArpActive.png",
  "images/section1/stringArpHover.png",
  "images/section1/taiko.png",
  "images/section1/taikoActive.png",
  "images/section1/taikoHover.png",
  "images/section1/vocal1_active.png",
  "images/section1/vocal1_hover.png",
  "images/section1/vocal2_active.png",
  "images/section1/vocal2_hover.png",
  "images/section1/vocal3_active.png",
  "images/section1/vocal3_hover.png",
  "images/section1/vocalSlider1.png",
  "images/section1/vocalSlider2.png",
  "images/section1/vocalSlider3.png",
  "images/section1/vocalSlider4.png",
  "images/section1/vocalSlider5.png",
  "images/section1/vocalSlider6.png",
  "images/section1/vocalSlider7.png",
  "images/section2/bass.png",
  "images/section2/bassActive.png",
  "images/section2/bassHover.png",
  "images/section2/chiral.png",
  "images/section2/chiralActive.png",
  "images/section2/chiralHover.png",
  "images/section2/clap.png",
  "images/section2/clapActive.png",
  "images/section2/clapHover.png",
  "images/section2/componentC.png",
  "images/section2/componentD.png",
  "images/section2/guitalele.png",
  "images/section2/guitaleleActive.png",
  "images/section2/guitaleleHover.png",
  "images/section2/percSlider1.png",
  "images/section2/percSlider2.png",
  "images/section2/percSlider3.png",
  "images/section2/percSlider4.png",
  "images/section2/percSlider5.png",
  "images/section2/percSlider6.png",
  "images/section2/percSlider7.png",
  "images/section2/percSlider8.png",
  "images/section2/vocals4Active.png",
  "images/section2/vocals5Active.png",
  "images/section2/vocalsHover.png",
  "images/section2/vocalsTopActive.png",
  "images/section3/bass.png",
  "images/section3/bassActive.png",
  "images/section3/bassHover.png",
  "images/section3/chiral.png",
  "images/section3/chiralActive.png",
  "images/section3/chiralHover.png",
  "images/section3/clap.png",
  "images/section3/clapActive.png",
  "images/section3/clapFeedback.png",
  "images/section3/clapFeedbackActive.png",
  "images/section3/clapFeedbackHover.png",
  "images/section3/clapHover.png",
  "images/section3/componentE.png",
  "images/section3/componentF.png",
  "images/section3/filternotch.png",
  "images/section3/filternotchActive.png",
  "images/section3/glitch.png",
  "images/section3/glitchActive.png",
  "images/section3/glitchHover.png",
  "images/section3/vocalsBotActive.png",
  "images/section3/vocalsBotHover.png",
  "images/section3/vocalsSlider1.png",
  "images/section3/vocalsSlider2.png",
  "images/section3/vocalsSlider3.png",
  "images/section3/vocalsSlider4.png",
  "images/section3/vocalsSlider5.png",
  "images/section3/vocalsSlider6.png",
  "images/section3/vocalsSlider7.png",
  "images/switch/base.png",
  "images/switch/base_small.png",
  "images/switch/circleActive.png",
  "images/switch/circleHover.png",
];

export function LoadingScreen(props) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressCap = useRef(1000);
  const ctx = useLocalContext({progress});

  const preloadImage = (src, loadCallback, errorCallback) =>
    new Promise((_) => {
      const image = new Image();
      image.onload = loadCallback;
      image.onerror = errorCallback;
      image.src = src;
      image.style = "display:none;";
      const el =  document.getElementsByTagName("body")[0];
      el.appendChild(image);
    });

  const incrementProgress = React.useCallback(() => {
    setProgress(ctx.progress + 1);
    console.log(`${ctx.progress}/${progressCap.current}`);
    if (ctx.progress == progressCap.current) setLoaded(true);
  }, [progress]);

  const loadAssets = (sampleData) => {
    progressCap.current = sampleData.length + images.length;
    Promise.all(
      images.map((x) => {
        preloadImage(x, incrementProgress, () => setError(true));
      })
    );
    return sampleData.map((s) => {
      const buffer = new Tone.Buffer(s.path);
      const player = new Tone.Player(buffer, incrementProgress);
      return player;
    });
  };

  useEffect(() => {
    fetch("composition.json")
      .then((res) => res.json())
      .then(
        (result) => {
          const players = loadAssets(result["samples"]);
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
            <a href="#" onClick={() => props.start()}>
              MASHANGOK
            </a>
          ) : error ? (
            `Error`
          ) : (
            `${Math.round(ctx.progress * 100 / progressCap.current)}%`
          )}
        </p>
      </div>
      {loaded ? (
        <div className="playButton" onClick={() => props.start()}>
          {" "}
        </div>
      ) : (
        ""
      )}
    </>
  );
}

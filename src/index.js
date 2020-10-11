import * as Tone from "tone";

var players = [];

const samples = {
    "hihats": "audio/hihats.mp3",
    "synth": "audio/synth.mp3"
  };

document.getElementById("sample-play").addEventListener("click", function(){
    const selectedSample = document.getElementById("sample-select").value;
    const distortionEnabled = document.getElementById("distortion").checked;
    const loopSample = document.getElementById("loop").checked;
    const distortionAmount = document.getElementById("distortion-amount").value;

    var player = new Tone.Player(samples[selectedSample]).toDestination();
    players.push(player);

    if (distortionEnabled)
    {
        const distortion = new Tone.Distortion(distortionAmount).toDestination();
        player.connect(distortion);
    }

    if (loopSample)
    {
        player.loop = true;
    }

    Tone.loaded().then(() => {
        player.start();
    });

});

document.getElementById("reset").addEventListener("click", function(){
    players.forEach(function(player){
        player.dispose();
    });

    players = [];
});

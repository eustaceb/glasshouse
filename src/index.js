import * as Tone from 'tone';

function component() {
  const element = document.createElement('button');

  element.onclick = function(){
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("C4", "8n");
  };

  element.innerHTML = "Play";

  return element;
}

document.querySelector("main").appendChild(component());

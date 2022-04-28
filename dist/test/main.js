const REDRAW_PERIOD = 300


let overlay = document.getElementById("overlay");
let width = overlay.width
let height = overlay.height

// used to limit the number of remapping on continuous screen change
let isSleeping = false

// slider stuff
let mousedownFlag = false
let sliderState = 0
let sliderPosition = 0



function updateCoordinates(id, proportion_coords)
{
  el = document.getElementById(id);
  result = []

  for (let i = 0; i < proportion_coords.length; i++)
  {
    if (i % 2 == 0)
    {
      result[i] = Math.round(proportion_coords[i] * width)
    }
    else
    {
      result[i] = Math.round(proportion_coords[i] * height)
    }
  }

  el.coords = result.join(", ")
}

async function remap() {
  if (!isSleeping)
  {
    // only redraw once in a while to not overcomplicate..
    // There can be 100 changes if window size is reduced by dragging
    // Avoid redrawing every time
    isSleeping = true
    await new Promise(r => setTimeout(r, REDRAW_PERIOD));
    isSleeping = false

    width = overlay.width
    height = overlay.height
    // remapping im_vocal_1
    updateCoordinates("im_vocal_1", [0.307292, 0.193519, 0.326042, 0.236111, 0.308854, 0.2738889, 0.286458, 0.243519])
    updateCoordinates("im_vocal_3", [665 / 1920, 355 / 1020, 40 / 1920])
    updateCoordinates("vocals_ping_pong", [479 / 1920, 550 / 1020, 683 / 1920, 770 / 1020])
  }
  // else there is already an active redrawer, so just do nothing and wait until it completes...



}



// --------------------------------------
// Strategies of listeners
// --------------------------------------

// On-off strategy (button with hover, active states)
function onOffListeners(el)
{
  el.addEventListener('mouseenter', function() {
    let id = this.id
    let hoverImg = document.getElementById(this.dataset.hover)

    hoverImg.classList.remove("hidden")
  });

  el.addEventListener('mouseleave', function() {
    let id = this.id
    let hoverImg = document.getElementById(this.dataset.hover)

    hoverImg.classList.add("hidden")
  });

  el.addEventListener('click', function(e) {
    e.preventDefault();

    const deactivate_ids = this.dataset.deactivate.split(",")

    let id = this.id
    let hoverImg = document.getElementById(this.dataset.hover)
    let activeImg = document.getElementById(this.dataset.active)


    // deactivate first, otherwise click of deactivated element could
    // deactivate the newly activated element.
    for (let i = 0; i < deactivate_ids.length; i++)
    {
      let el = document.getElementById(deactivate_ids)
      if (el.classList.contains('active'))
      {
        el.click()
      }
    }

    if (activeImg.classList.contains("hidden"))
    {
      activeImg.classList.remove("hidden")
      this.classList.add("active") // used to identify active elements for deactivation
    }
    else {
      activeImg.classList.add("hidden")
      this.classList.remove("active") // used to identify active elements for deactivation
    }

  });
}


// Slider strategy (slides down some finite steps)
function downSliderListeners(el)
{
  el.addEventListener('mousedown', function(e) {
    e.preventDefault()
    mousedownFlag = true
    // console.log("mousedown - on")
  });

  el.addEventListener('click', function(e) {
    e.preventDefault()
  });

  el.addEventListener('mouseup', function() {

    mousedownFlag = false
    // console.log("mousedown - off")
  });

  el.addEventListener('mousemove', function(e)
  {
    if(mousedownFlag) {
      let nextPosition = sliderPosition + e.movementY;
      nextPosition = Math.max(Math.min(100, nextPosition), 0);

      sliderPosition = nextPosition
      sliderState = Math.trunc(sliderPosition / 100 * 6)
      // console.log(sliderState)

      // will be much better with react state....
      // activate relevant steps

      let steps = this.dataset.steps.split(",")
      for (let i = 0; i < steps.length; i++)
      {
        let step = document.getElementById(steps[i])
        if (i < sliderState)
        {
          step.classList.remove("hidden")
        }
        else
        {
          step.classList.add("hidden")
        }
      }

    }
  });
}






document.querySelectorAll("area").forEach(function(el){

  const types = {"on-off" : onOffListeners, "downSlider" : downSliderListeners}


  const type = el.dataset.type


  if (type in types)
  {
    types[type](el)
  }
  else
  {
    alert("Error: wrong element type")
  }
});

window.onresize = remap;
remap()

import React from "react";

export function Popup(props) {
  return (
    <>
      <div
        className={"darkBackground" + (props.isOpen ? "" : " hidden")}
        onClick={() => props.toggle()}
      />
      <div className={"popupClose" + (props.isOpen ? "" : " hidden")}>
        <div className="xButton" onClick={() => props.toggle()}></div>
      </div>
      <div className={"popup" + (props.isOpen ? "" : " hidden")}>
        {props.content}
      </div>
    </>
  );
}

export function AboutPopup(props) {
  const contentAbout = (
    <div className="colContainer">
      <div className="col">
        <div className="textContainer">
          <p>
            Five friends from different backgrounds decided to make their lives
            just that one bit harder, challenge their friendship and combine
            their knowledge in sound, graphic design and programming in order to
            create this platform of sonic exploration.
          </p>
          <p>
            This project aims to let visitors interact with the music in a more
            collaborative way, to have people become part of the project, not
            external to it. Our aim is to enable the person interacting with our
            platform to always create something different, to engage mentally
            and emotionally.
          </p>
          <p>
            The samples on the site are taken from Glasshouse, the final track
            of Más Hangok EP entitled Contemporary Man. Más Hangok
            (2016-present) is a collaborative project between Lithuanian born
            Glasgow based composer & instrument designer Guoda Dirzyte and
            Hungarian born Brighton based vocalist & lyricist Maja Mihalik. As a
            collective, our work aims to explore the possibilities of new worlds
            by experimenting with various sonic cultures and music creation
            tools.
          </p>
          <p>
            You can listen to more of Más Hangok music on all major streaming
            platforms.
          </p>
        </div>
      </div>
      <div className="col">
        <div className="textContainer">
          <p className="heading">Credits</p>
          <p>
            <strong>
              Composition, production, mixing and sample selection:
            </strong>{" "}
            <br /> Guoda Diržytė
          </p>
          <p>
            <strong>Vocals and lyrics:</strong> <br /> Maja Mihalik
          </p>
          <p>
            <strong>Design and artwork:</strong> <br /> Gustav Freij
          </p>
          <p>
            <strong>Software development:</strong>
            <br />
            Justas Bikulčius
            <br />
            Danielius Šukys
          </p>
          <p>
            <strong>Supported by:</strong>
          </p>
          <div className="logoContainer">
            <a
              href="https://www.helpmusicians.org.uk/"
              target="_blank"
              className="link">
              <img
                src="images/popup/help_musicians_white.png"
                className="supporterLogo"
              />
            </a>
            <a
              href="https://www.artscouncil.org.uk/"
              target="_blank"
              className="link">
              <img
                src="images/popup/grant_white.png"
                className="supporterLogo"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <Popup content={contentAbout} toggle={props.toggle} isOpen={props.isOpen} />
  );
}

export function HelpPopup(props) {
  const contentHelp = (
    <div className="colContainer">
      <div className="col">
        <div className="textContainer">
          <h3>Navigation</h3>
          <p>At the bottom of the window, you should see arrows which allow changing to a different section of the piece.</p>
          <h3>Instruments</h3>
          <p>All interactions are done via a mouse.</p>
          <p>On the left hand side of the page you've got a component that allows you to switch between different samples of the <b>vocals</b>.</p>
          <p>On the right hand side of the page you've got a component that allows you to switch between different samples of the <b>percussion</b>.</p>
          <p>In the centre, you've got 4-6 different instruments that you can loop by clicking on them.</p>
          <h3>Effects</h3>
          <p>By exploring the sections, you'll come across three different types of effect controls for manipulating vocals and percussion.</p>
          <ul>
            <li>Vertical slider - controls the dry/wet signal of an effect or pitch shift amount in 3rd section.</li>
            <li>Tristate control - three circles found below vertical sliders, allows to choose one of preset delay times.</li>
            <li>XY pad - two parameter control that sets the panning and filter depending on the x and y coordinates of the pin.</li>
          </ul>
        </div>
      </div>
    </div>
  );
  return (
    <Popup content={contentHelp} toggle={props.toggle} isOpen={props.isOpen} />
  );
}

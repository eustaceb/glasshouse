import React from "react";

export function Navigation(props) {
  const sectionIndex = props.sectionIndex;
  return (
    <div className="navigation">
      {sectionIndex > 0 ? (
        <div
          className="navigationArrowLeft"
          onClick={() => props.setSection(sectionIndex - 1)}
        />
      ) : (
        <div className="navigationMarkerLeft" />
      )}
      <div className="navigationRepeat" />
      <div className="navigationMute"/>
      <div className="navigationRepeat" />
      {sectionIndex < props.sectionCount - 1 ? (
        <div
          className="navigationArrowRight"
          onClick={() => props.setSection(sectionIndex + 1)}
        />
      ) : (
        <div className="navigationMarkerRight" />
      )}
    </div>
  );
}

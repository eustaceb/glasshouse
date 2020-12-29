import React, { useState } from "react";

export function SamplePad(props) {

    const styles = {
        selectableSquare: {
            backgroundColor: "purple",
            width: 100,
            height: 100,
            cursor: "pointer",
        },
        round: {
            borderRadius: 10
        },
        sampleLabel: {
            textAlign: "center",
            color: "white"
        },
        nonselectable: {
            "WebkitTouchCallout": "none",
            "WebkitUserSelect": "none",
            "KhtmlUserSelect": "none",
            "MozUserSelect": "none",
            "MsUserSelect": "none",
            "UserSelect": "none"
        },
        selected: {
            backgroundColor: "mediumvioletred",
        }
    };

    let containerStyle = { ...styles.selectableSquare, ...styles.round };
    if (props.selected) {
        containerStyle = { ...containerStyle, ...styles.selected };
    }

    return <div style={containerStyle} onClick={props.onClick}>
        <p style={{ ...styles.sampleLabel, ...styles.nonselectable }}>{props.sample.name}</p>
    </div>;
}

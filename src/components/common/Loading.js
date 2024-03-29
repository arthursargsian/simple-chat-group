import React from "react";

function Loading() {
    return (
        <div className="wrapper">
            <div className="loading-block" id="loading-container">
                <svg viewBox="0 0 100 100">
                    <defs>
                        <filter id="shadow">
                            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#fc6767"/>
                        </filter>
                    </defs>
                    <circle id="spinner" style={{
                        fill: "transparent",
                        stroke: "orange",
                        strokeWidth: 7,
                        strokeLinecap: "round",
                        filter: "url(#shadow)"
                    }} cx="50" cy="50" r="45"/>
                </svg>
            </div>
        </div>
    );
}

export default Loading;

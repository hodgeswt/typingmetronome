import React from "react";

import Header from "./components/Header.js";
import Metronome from "./components/Metronome.js";
import TextInput from "./components/TextInput.js";

export default function App() {
  // a style that horizontally centers all its children
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
  };

  return (
    <div>
      <div style={containerStyle}>
        <Header />
      </div>
      <div style={containerStyle}>
        <Metronome />
      </div>
      <div style={containerStyle}>
        <TextInput />
      </div>
    </div>
  );
}

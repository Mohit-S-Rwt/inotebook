import React from "react";

import { useState } from "react";

import Notes from "./Notes";

const Home = () => {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  return (
    <div>
      <Notes showAlert={showAlert} />
    </div>
  );
};

export default Home;

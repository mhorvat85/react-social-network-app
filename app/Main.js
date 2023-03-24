import React from "react";
import ReactDOM from "react-dom/client";

const Main = () => {
  return <div>Welcome to app!</div>;
};

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}

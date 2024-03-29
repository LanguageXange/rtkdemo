import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App2 from "./App2";


import { Provider } from "react-redux";
import { store } from "./app/store.ts";
// https://redux-toolkit.js.org/rtk-query/api/ApiProvider
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App2 />
    </Provider>
  </React.StrictMode>
);

{
  /* <ApiProvider api={apiSlice}> 
<App2 /> 
</ApiProvider>  */
}

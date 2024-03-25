import type { RootState } from "./store";
import { Middleware, isAction } from "@reduxjs/toolkit";

// https://github.com/reduxjs/redux-toolkit/issues/3895
// action is unknown type
export const logger: Middleware<object, RootState> =
  (store) => (next) => (action) => {
    if (!isAction(action)) return;
    if (!action.type) {
      return next(action);
    }
    console.log("----------");
    console.log("Action Type: ", action.type);
    console.log("Action Payload: ", action.payload);
    console.log("%c Current State: ", "background:green", store.getState());

    next(action);

    console.log("%c Next State: ", "background:#4c0ffb", store.getState());
  };

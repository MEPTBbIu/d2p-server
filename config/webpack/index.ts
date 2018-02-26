"use strict";
const __module = (process.env.NODE_ENV === "production") ? require("./prod") : require("./dev");

export default __module;
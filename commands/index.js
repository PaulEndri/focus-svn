import mergeString from "./mergeString.js";
import rebase from "./rebase.js";
import createBranch from "./createBranch.js";
import switchBranch from "./switchBranch.js";
import removeBranch from "./removeBranch.js";
import config from "./config.js";

export default [
    mergeString, rebase, switchBranch, createBranch, config, removeBranch
];
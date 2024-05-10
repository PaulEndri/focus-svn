import mergeString from "./mergeString.js";
import rebase from "./rebase.js";
import createBranch from "./createBranch.js";
import checkoutBranch from "./checkoutBranch.js";
import switchBranch from "./switchBranch.js";
import removeBranch from "./removeBranch.js";
import config from "./config.js";
import mergeBranch from "./mergeBranch.js";

export default [
    mergeBranch,
    mergeString,
    checkoutBranch,
    rebase,
    switchBranch,
    createBranch,
    config, 
    removeBranch
];
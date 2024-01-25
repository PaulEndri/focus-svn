import { activeVersion } from "./constants.js";

export default {
    focusVersion: {
        alias: 'fv',
        default: activeVersion,
        describe: 'focus trunk version to use',
        requiresArg: false,
        global: true,
        number: true
    },
    cwd: {
        alias: 'pwd',
        default: process.cwd(),
        describe: 'directory to execute commands from',
        requiresArg: false,
        global: true,
        string: true
    }
}

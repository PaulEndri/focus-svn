import { activeVersion } from "./constants.js";

export default {
    version: {
        alias: 'v',
        default: activeVersion,
        describe: 'focus trunk version to use',
        global: true,
        number: true
    },
    cwd: {
        alias: 'pwd',
        default: process.cwd(),
        describe: 'directory to execute commands from',
        global: true,
        string: true
    }
}

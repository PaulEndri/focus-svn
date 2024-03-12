export default {
    focusVersion: {
        alias: ['fv', 'version'],
        default: null,
        describe: 'focus trunk version to use',
        requiresArg: false,
        global: true
    },
    silent: {
        alias: ['s'],
        default: null,
        type: 'boolean',
        describe: 'silence all output',
        requiresArg: false,
        global: true
    },
    verbose: {
        alias: ['v'],
        default: null,
        type: 'boolean',
        describe: 'return extra/verbose output',
        requiresArg: false,
        global: true
    }
}

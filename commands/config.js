export default {
    command: 'config',
    describe: 'change tool default variables',
    builder: {
        activeTrunk: {
            alias: ['trunk'],
            default: null
        },
        root: {
            default: null,
        },
        branchPrefix: {
            alias: ['prefix'],
            default: null,
            type: 'string'
        }
    },
    handler: async function changeConfig(argv) {
        const updates = ['activeTrunk', 'branchPrefix', 'root'].map(async key => {
            if (argv[key]) {
                originalValue = argv.config[key];
                await argv.config.save(key, argv[key]);
                svn.log(`[Success] Updated ${key} from ${originalValue} to ${argv[key]}`)
            }
        });

        await Promise.all(updates);
    }
}
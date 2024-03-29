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
        },
        output: {
            default: null,
            options: ['normal', 'silent', 'verbose'],
            type: 'string'
        }
    },
    handler: async function changeConfig({ svn, configService: config, ...data}) {
        const updates = ['activeTrunk', 'branchPrefix', 'root'].map(async key => {
            if (data[key]) {
                originalValue = data[key];
                svn.log(`Updating ${key} to ${value}`);
                await config.save(key, data[key]);
                svn.log(`Success! Updated ${key} from ${originalValue} to ${data[key]}`)
            }
        });

        if (data.output) {
            let silent = null;
            let verbose = null;

            switch(data.output) {
                case 'normal': {
                    silent = false;
                    verbose = false;
                    break;
                }
                case 'verbose': {
                    silent = false;
                    verbose =  true;
                    break;
                }
                case 'silent': {
                    silent = true;
                    verbose = false;
                    break;
                }
                default:
                    break;
            }

            if (silent !== null) {
                svn.log(`Updating default output mode to ${data.mode}`);
                updates.push(
                    config.save('verbose', verbose),
                    config.save('silent', silent)
                );
            }
        }

        await Promise.all(updates);
    }
}
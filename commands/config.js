import fs from 'node:fs/promises';
const envFileLocation = `env`;
console.log(envFileLocation)
export default {
    command: 'asdasdsd',
    describe: 'change tool default variables',
    builder: {
        trunk: {
            type: 'number',
            demandOption: false,
            describe: 'change the default trunk version',
            optional: true
        }
    },
    handler: async function changeConfig({trunk}) {
        console.log('[test]', { envFileLocation});

        const config = await fs.readFile(envFileLocation, { encoding: 'utf-8' });
        console.log('[test]', { config});

        const commands = Object.fromEntries(config.split('\n').map(l => l.split('=').map(e => e.trim())));
        commands.ACTIVE_TRUNK = trunk;
        const fileData = Object.entries(commands).map(e => e.join('=')).join('\n');
        await fs.writeFile(envFileLocation, fileData);
    }
}
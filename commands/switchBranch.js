import { getBranchName, getUrls } from "../helpers.js";
import { SVN } from "../svn.js";

export default {
    command: 'switch',
    aliases: ['co', 'cp'],
    describe: "switch current directory branch",
    builder: {
        branch: { default: null }
    },
    handler: async function switchBranch({ version, branch }) {
        const svn = new SVN(process.cwd());
        const { dev, trunk } = getUrls(version);

        if (branch === 'trunk') {
            console.log(await svn.switch(trunk));
            return;
        }

        console.log(await svn.switch(`${dev}/${await getBranchName(branch)}`));
    }
}

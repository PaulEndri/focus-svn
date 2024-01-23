import { getBranchName, getUrls } from "../helpers.js";
import { SVN } from "../svn.js";

export default {
    command: 'branch',
    describe: 'create a branch',
    builder: {
        branch: { default: null },
        switch: { default: false }
    },
    handler: async function createBranch({ cwd, version, branch, sw }) {
        const { dev, trunk } = getUrls(version);
        const svn = new SVN(cwd);
        const url = `${dev}/${await getBranchName(branch)}`;
        console.log(await svn.createBranch(trunk, url));

        if (sw) {
            console.log(await svn.switch(url));
        }
    }
}

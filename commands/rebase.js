import { SVN } from '../svn.js';
import { getBranchName, getUrls } from '../helpers.js';

export default {
    command: 'rebase',
    describe: 'create a new branch off the chosen trunk and merge the target branch into it',
    builder: {
        branch: { default: null },
        reverse: { default: false, describe: 'optional to reverse the --rebase-temp suffix to recreate original' }
    },
    handler: async function rebase({version, branch, cwd, reverse}) {
        const { dev, trunk } = getUrls(version);
        const svn = new SVN(cwd);
        const branchName = await getBranchName(branch);
        const tmpBranch = reverse ? `${dev}/${branchName.replace('-rebase-temp', '')}` : `${dev}/${branchName}-rebase-temp`;
        const targetBranch = `${dev}/${branchName}`;
        const history = await svn.getHistory();
        const { revision } = history.pop();

        if (reverse) {
            console.log(await svn.remove(tmpBranch));
        }

        console.log(`[Creating ${tmpBranch} from ${revision}]`)
        console.log(await svn.createBranch(trunk, tmpBranch));
        console.log(await svn.switch(tmpBranch));
        console.log(await svn.merge(targetBranch, revision));
    }
}
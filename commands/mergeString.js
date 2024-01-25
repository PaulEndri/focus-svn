import { root } from "../constants.js";
import { SVN } from "../svn.js";

export default {
    command: 'getMergeString',
    alias: ['ms'],
    describe: 'spit out a copy/paste ready merge string for local branch',
    handler: async function mergeString({ cwd }) {
        console.log('[test]');
        const svn = new SVN(cwd);
        const info = await svn.localInfo();

        const [{revision}] = await svn.getHistory();

        console.log(svn.mergeString(info['Relative URL'].replace('^', root), revision));
    }
}

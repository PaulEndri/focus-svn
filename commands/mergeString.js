import { root } from "../constants.js";
import { SVN } from "../svn.js";

export default {
    command: 'mergeString',
    describe: 'spit out a copy/paste ready mergestring',
    handler: async function mergeString({ cwd }) {
        const svn = new SVN(cwd);
        const info = await svn.localInfo();
        const [{revision}] = await svn.getHistory();

        console.log(svn.mergeString(info['Relative URL'].replace('^', root), revision));
    }
}

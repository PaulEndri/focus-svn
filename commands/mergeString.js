export default {
    command: 'getMergeString',
    aliases: ['ms'],
    describe: 'spit out a copy/paste ready merge string for local branch',
    builder: {
        branchName: {
            type: 'string',
            default: null
        },
        branchSource: {
            type: 'string',
            default: null,
            describe: 'Use this as url base instead of automatically generated root'
        }
    },
    handler: async function mergeString({ branch, svn, branchSource }) {
        const { dev } = svn.getUrls();
        const branchName = await svn.getBranchName(branch)
        const branchUrl = `${branchSource ?? dev}/${branchName}`;

        const info = await svn.info(branchUrl);
        const revision = info['Revision'];

        svn.log(svn.mergeString(branchUrl, revision));
    }
}

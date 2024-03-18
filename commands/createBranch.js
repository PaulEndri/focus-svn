export default {
    command: 'cp [branchName]',
    aliases: ['create', 'branch'],
    describe: 'create a branch',
    builder: {
        branch: { default: null },
        switchBranch: { default: false, alias: ['switch'], type: 'boolean' },
        prefix: { default: null, type: 'string'}
    },
    handler: async function createBranch({
        branch,
        switchBranch,
        branchName,
        svn
    }) {
        const actualBranch = branchName || branch;
        const branchName = await svn.getBranchName(actualBranch);
        const { dev, trunk } = svn.getUrls();
        const url = `${dev}/${branchName}`;

        await svn.createBranch(trunk, url);

        svn.log(`Created Branch: ${url}`);

        if (switchBranch) {
            svn.log(`Switching to Branch: ${url}`);
            await svn.switch(url);
        }
    }
}

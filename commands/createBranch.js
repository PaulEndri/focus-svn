export default {
    command: 'cp [branchName]',
    aliases: ['create', 'branch'],
    describe: 'create a branch',
    builder: {
        branch: { describe: 'branch name or jira number', default: null },
        switchBranch: { describe: 'also switch active directory to branch (optional)', default: false, alias: ['switch'], type: 'boolean' },
        prefix: { describe: 'branch prefix (default: FOCUS, optional)', default: null, type: 'string'}
    },
    handler: async function createBranch({
        branch,
        switchBranch,
        branchName,
        svn
    }) {
        const actualBranch = branchName || branch;
        const fullBranchName = await svn.getBranchName(actualBranch);
        const { dev, trunk } = svn.getUrls();
        const url = `${dev}/${fullBranchName}`;

        await svn.createBranch(trunk, url);

        svn.log(`Created Branch: ${url}`);

        if (switchBranch) {
            svn.log(`Switching to Branch: ${url}`);
            await svn.switch(url);
        }
    }
}

export default {
    command: 'checkout [branchName]',
    alias: ['co'],
    describe: "switch current directory branch",
    builder: {
        branch: { default: null },
        target: { default: null, type: 'string' }
    },
    handler: async function switchBranch({ svn, branch, branchName, target }) {
        let activeBranch = branchName ?? branch;
        let branchUrl = '';
        let targetDir = target;

        const { dev, trunk } = svn.getUrls();

        if (activeBranch !== 'trunk') {
            activeBranch = await svn.getBranchName(activeBranch);
            branchUrl = `${dev}/${activeBranch}`;
        } else {
            branchUrl = trunk;
        }

        if (!targetDir) {
            targetDir = activeBranch
        }
        await svn.switch(activeBranch);

        svn.log(`Checked out ${branchUrl} to ${targetDir}`);

    }
}

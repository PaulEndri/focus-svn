export default {
    command: 'checkout [branchName] [targetName]',
    aliases: ['co'],
    describe: "checkout branch in current directory",
    builder: {
        branch: { default: null },
        target: { default: null, type: 'string' }
    },
    handler: async function switchBranch({ svn, branch, branchName, targetName, target }) {
        let activeBranch = branchName ?? branch;
        let branchUrl = '';
        let targetDir = target ?? targetName;

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

        svn.log(`Checking out ${branchUrl}`);

        await svn.checkoutBranch(branchUrl, targetDir);

        svn.log(`Checked out ${branchUrl} to ${targetDir}`);

    }
}

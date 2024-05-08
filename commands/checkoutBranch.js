export default {
    command: 'checkout [branchNumber] [targetDir]',
    aliases: ['co'],
    describe: "checkout branch in current directory",
    builder: {
        branch: { default: null, describe: 'branch name or jira number' },
        target: { default: null, describe: 'directory to checkout branch into (optional)', type: 'string' }
    },
    handler: async function switchBranch({ svn, branch, branchNumber, targetName, target }) {
        let activeBranch = branchNumber ?? branch;
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

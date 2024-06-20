export default {
    command: 'remove [branchName]',
    aliases: ['rm'],
    describe: 'remove a branch from svn',
    builder: {
        branch: { default: null, type: 'string', describe: 'branch name/number to delete' }
    },
    handler: async function remove({
        branch,
        branchName,
        svn
    }) {
        const actualBranch = branchName || branch;

        if (!actualBranch) {
        }
        const { dev } = svn.getUrls();
        const branchUrl = await svn.getBranchName(actualBranch);
        await svn.remove(`${dev}/${branchUrl}`);

        svn.log(`Removed branch ${branchName} from svn`);
    }
}
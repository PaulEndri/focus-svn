export default {
    command: 'remove',
    aliases: ['rm'],
    describe: 'remove a branch from svn',
    builder: {
        branch: { default: null, type: 'string', describe: 'branch name/number to delete' }
    },
    handler: async function rebase({
        branch,
        svn
    }) {
        const { dev } = svn.getUrls();
        const branchName = await svn.getBranchName(branch);
        await svn.remove(`${dev}/${branchName}`);

        svn.log(`Removed branch ${branchName} from svn`);
    }
}
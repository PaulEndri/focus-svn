export default {
    command: 'remove',
    aliases: ['rm'],
    describe: 'remove a branch from svn',
    builder: {
        target: { default: null, type: 'string' },
        source: { default: null, type: 'string' },
        branch: { default: null, type: 'string' }
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
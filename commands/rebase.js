export default {
    command: 'rebase',
    describe: 'create a new branch off the chosen trunk and merge the target branch into it',
    builder: {
        target: { default: null, type: 'string', describe: 'branch name to rebase into' },
        source: { default: null, type: 'string', describe: 'source branch name' },
        branch: { default: null, type: 'string', describe: 'branch name/number' },
				resolve: { default: 'p', type: 'string', describe: 'resolve option for merge' }
    },
    handler: async function rebase({
        target,
        source,
        branch,
				resolve,
        svn
    }) {
        const { dev, trunk } = svn.getUrls();
        const branchName = await svn.getBranchName(branch);
        const targetBranch = target ? `${dev}/${target}` : `${dev}/${branchName}-rebase-temp`;
        const sourceBranch = source ? `${dev}/${source}` : `${dev}/${branchName}`;
        const history = await svn.getHistory(sourceBranch);
        const { revision } = history.pop();


        svn.log(`Creating ${targetBranch} from ${revision}`);
        await svn.createBranch(trunk, targetBranch);
        svn.log(`Switching active branch to ${targetBranch}`);
        await svn.switch(targetBranch);
        svn.log(`Merging ${sourceBranch} at revision ${revision} into active branch`);
        svn.log(await svn.merge(sourceBranch, revision, './', 'HEAD', resolve));
    }
}
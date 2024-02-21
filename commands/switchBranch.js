export default {
    command: 'switch [autoBranch]',
    describe: "switch current directory branch",
    builder: {
        branch: { default: null }
    },
    handler: async function switchBranch({ svn, branch, autoBranch }) {
        let activeBranch = autoBranch ?? branch;
        const { dev } = svn.getUrls();

        if (activeBranch !== 'trunk') {
            activeBranch = `${dev}/${await svn.getBranchName(activeBranch)}`;
        }

        await svn.switch(activeBranch);

        svn.log(`Switched to ${activeBranch}`);

    }
}

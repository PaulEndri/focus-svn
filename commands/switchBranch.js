export default {
	command: "switch [branchName]",
	aliases: ["s"],
	describe: "switch current directory branch",
	builder: {
		branch: {
			default: null,
			type: "string",
			describe: "branch name/number to switch current working directory to",
		},
	},
	handler: async function switchBranch({ svn, branch, branchName }) {
		let activeBranch = branchName ?? branch;
		let branchUrl = "";

		const { dev, trunk } = svn.getUrls();

		if (activeBranch !== "trunk") {
			activeBranch = await svn.getBranchName(activeBranch);
			branchUrl = `${dev}/${activeBranch}`;
		} else {
			branchUrl = trunk;
		}

		await svn.switch(branchUrl);
		svn.log(`Switched to ${activeBranch}`);
	},
};

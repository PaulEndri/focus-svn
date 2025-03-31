export default {
	command: "checkout [branchNumber] [targetDir]",
	aliases: ["co", "clone"],
	describe: "checkout branch into current directory, with Jira integration",
	builder: {
		branch: { default: null, describe: "branch name or jira number" },
		target: {
			default: null,
			describe: "directory to checkout branch into (optional)",
			type: "string",
		},
		b: {
			default: false,
			type: "boolean",
			describe: "set to true to create branch if it does not exist",
		},
	},
	handler: async function switchBranch({
		svn,
		jira,
		b,
		branch,
		branchNumber,
		targetName,
		target,
	}) {
		// Parse the branch number to extract project and ticket number
		let activeBranch = branchNumber ?? branch;
		let branchUrl = "";
		let targetDir = target ?? targetName;

		const { dev, trunk } = svn.getUrls();

		if (activeBranch !== "trunk") {
			activeBranch = await svn.getBranchName(activeBranch);
			branchUrl = `${dev}/${activeBranch}`;
		} else {
			branchUrl = trunk;
		}

		if (!targetDir) {
			targetDir = activeBranch;
		}

		const branchExists = await svn.verify(branchUrl);

		if (branchExists || (b && activeBranch !== "trunk")) {
			if (!branchExists) {
				svn.log(`Creating branch ${activeBranch}`);
				await svn.createBranch(trunk, branchUrl);
			}
			svn.log(`Checking out ${branchUrl}`);

			const inWorkingDir = await svn.isCurrentDirectoryValid();

			if (inWorkingDir) {
				await svn.switch(branchUrl);
			} else {
				await svn.checkoutBranch(branchUrl, targetDir);
				svn.log(`Checked out ${branchUrl} to ${targetDir}`);
			}
		} else {
			svn.log(`Branch ${activeBranch} does not exist`);
		}
	},
};

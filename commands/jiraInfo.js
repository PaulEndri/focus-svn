export default {
  command: "jiraInfo [branchName]",
  aliases: ["jira"],
  describe: "get jira information",
  builder: {
    branch: {
      default: null,
      type: "string",
      describe: "branch name/number to switch current working directory to",
    },
  },
  handler: async function switchBranch({ jira, branch, branchName }) {
    const activeBranch = branchName ?? branch;

    let issueNumber = activeBranch;

    if (isNaN(issueNumber)) {
      const parts = activeBranch.split("-");
      issueNumber = parts.length > 1 ? parts[1] : activeBranch;
    }
    const data = await jira.getTicketInfo(issueNumber);
		if (data) {
			console.log(`Jira Ticket Information: ${issueNumber}`);
			Object.entries(data).forEach(([key, value]) => {
				console.log(`[${key}] ${value}`);
			});
		} else {
			console.log('Unable to get Jira ticket information');
		}
  },
};

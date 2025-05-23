export default {
  command: "getMergeString [branch]",
  aliases: ["ms"],
  describe: "spit out a copy/paste ready merge string for local branch",
  builder: {
    branchName: {
      type: "string",
      describe:
        "branch to get a merge string for (default: working branch, optional)",
      default: null,
    },
    branchSource: {
      type: "string",
      default: null,
      describe:
        "Use this as url base instead of automatically generated root (default: svn root)",
    },
  },
  handler: async function mergeString({
    branchName,
    branch,
    svn,
    branchSource,
  }) {
    const { dev } = svn.getUrls();
    const activeBranch = await svn.getBranchName(branch ?? branchName);
    const branchUrl = `${branchSource ?? dev}/${activeBranch}`;

    const info = await svn.getHistory(branchUrl);

    svn.log(svn.mergeString(branchUrl, info.pop().revision));
  },
};

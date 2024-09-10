export default {
  command: "merge [branch]",
  aliases: ["m"],
  describe: "merge specified branch into active or target branch",
  builder: {
    branchName: {
      type: "string",
      describe: "branch to merge",
      default: null,
    },
    target: {
      type: "string",
      default: "./",
      describe: "brange to merge into (optional)",
    },
  },
  handler: async function mergeString({ branch, branchName, svn, target }) {
    const { dev } = svn.getUrls();
    const svnBranchName = await svn.getBranchName(branch ?? branchName);
    const branchUrl = `${dev}/${svnBranchName}`;
    const history = await svn.getHistory(branchUrl);
    const { revision } = history.pop();

    const targetBranch =
      target !== "./" ? `${dev}/${svn.getBranchName(target)}` : target;
    svn.log(
      `Merging ${svnBranchName} at revision ${revision} into active branch`,
    );
    svn.log(await svn.merge(sourceBranch, revision, targetBranch));
  },
};

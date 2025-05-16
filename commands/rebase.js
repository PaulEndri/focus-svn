import { DateTime } from "luxon";

export default {
  command: "rebase",
  describe:
    "create a new branch off the chosen trunk and merge the target branch into it",
  builder: {
    target: {
      default: null,
      type: "string",
      describe: "branch name to rebase into",
    },
    source: { default: null, type: "string", describe: "source branch name" },
    branch: { default: null, type: "string", describe: "branch name/number" },
    resolve: {
      default: "p",
      type: "string",
      describe: "resolve option for merge",
    },
  },
  handler: async function rebase({
    target,
    jira,
    source,
    branch,
    resolve,
    svn,
  }) {
    const { dev, trunk } = svn.getUrls();
    const fullBranchName = await svn.getBranchName(branch);
    const branchName = fullBranchName.split("-").slice(0, 2).join("-");
    g;
    const dateSuffix = DateTime.now().toFormat("MMdd");
    const targetBranchName = `${branchName}-${dateSuffix}`;
    const targetBranch = target
      ? `${dev}/${target}`
      : `${dev}/${targetBranchName}`;
    const sourceBranch = source ? `${dev}/${source}` : `${dev}/${branchName}`;
    const history = await svn.getHistory(sourceBranch);
    const { revision } = history.pop();

    svn.log(`Creating ${targetBranch} from ${revision}`);
    await svn.createBranch(trunk, targetBranch);
    svn.log(`Switching active branch to ${targetBranch}`);

    await jira.updateBranch(
      targetBranchName.split("-")[0],
      targetBranchName.split("-")[1],
      targetBranchName,
    );
    await svn.switch(targetBranch);
    svn.log(
      `Merging ${sourceBranch} at revision ${revision} into active branch`,
    );
    svn.log(await svn.merge(sourceBranch, revision, "./", "HEAD", resolve));
  },
};

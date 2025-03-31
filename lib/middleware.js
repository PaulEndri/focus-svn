import { InstanceConfig } from "./config.js";
import { SVN } from "./svn.js";
import { JiraService } from "./jira.js";

export const configMiddleware = async (argv) => {
  const configService = InstanceConfig;
  const config = await configService.getConfig();
  const cwd = process.cwd();

  if (argv.repoVersion) {
    config.version = argv.repoVersion;
  }

  const data = {
    ...config,
    cwd,
    verbose: argv.verbose ?? config.verbose,
    silent: argv.silent ?? config.silent,
    version: argv.version ?? config.activeTrunk,
    repoRoot: argv.root ?? config.root,
    prefix: argv.prefix ?? config.branchPrefix,
  };

  const jira = new JiraService(data);
	const svn = new SVN(data, jira);
  return {
    ...argv,
    svn,
    jira,
    configService,
  };
};

import { InstanceConfig } from "./config.js";
import { SVN } from "./svn.js";

export const configMiddleware = async (argv) => {
    const configService = InstanceConfig;
    const config = await configService.getConfig();
    const cwd = process.cwd();

    if (argv.focusVersion) {
        config.version = argv.focusVersion;
    }

    const data = {
        ...config,
        cwd,
        verbose: argv.verbose ?? config.verbose,
        silent: argv.silent ?? config.silent,
        version: argv.version ?? config.activeTrunk,
        focusRoot: argv.root ?? config.root,
        prefix: argv.prefix ?? config.branchPrefix
    };

    const svn = new SVN(data);

    return {
        ...argv,
        svn,
        configService
    };
};

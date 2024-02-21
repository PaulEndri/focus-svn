import { InstanceConfig } from "./config.js";
import { SVN } from "./svn.js";

export const configMiddleware = async (argv) => {
    const configService = InstanceConfig;
    const config = await configService.getConfig();
    const cwd = process.cwd();

    if (argv.focusVersion) {
        config.activeVersion = argv.focusVersion;
    }

    const data = {
        ...config,
        cwd,
        version: argv.version ?? config.activeTrunk,
        focusRoot: argv.root ?? config.root,
        prefix: argv.prefix ?? config.branchPrefix
    };

    const svn = new SVN(data);

    if (!!argv.verbose) {
        console.log('[DEBUG] Loaded Config Data', JSON.stringify(data, null, 2));
    }

    return {
        ...argv,
        svn,
        configService
    };
};

export default {
  command: "config",
  describe: "change tool default variables",
  builder: {
    activeTrunk: {
      alias: ["trunk"],
      default: null,
      describe: "set this to change the default trunk version to use as tool",
    },
    root: {
      default: null,
      describe: "configure svn root",
    },
    branchPrefix: {
      alias: ["prefix"],
      default: null,
      type: "string",
      describe: "set the default branch prefix",
    },
    output: {
      default: null,
      options: ["normal", "silent", "verbose"],
      type: "string",
      describe: "svn output type",
    },
    verbose: {
      default: null,
      type: "boolean",
    },
    silent: {
      default: null,
      type: "boolean",
    },
		jiraHost: {
			default: null,
			type: "string",
			describe: "jira source url"
		},
		jiraUserName: {
			default: null,
			type: "string",
			describe: "jira username",
		},
		jiraToken: {
			default: null,
			type: "string",
			describe: "jira api key",
		},
    branchDir: {
      default: null,
      type: "string",
      describe: "svn branch directory",
    },
    extract: {
      default: null,
      type: "boolean",
      describe: "echo out the config json",
    },
  },
  handler: async function changeConfig({
    svn,
    configService: config,
    extract,
    load,
    ...data
  }) {
    if (extract) {
      const configData = await config.getConfig();
      const inputs = Object.entries(configData)
        .map(([key, value]) => `--${key}=${value}`)
        .join(" ");
      svn.log(`node-svn config ${inputs}`);
      return;
    }

    if (load) {
      console.log(load);
      const newConfig = JSON.parse(load);

      await config.overwrite(newConfig);

      svn.log("Updated config");
      return;
    }

    const updates = [
      "verbose",
      "silent",
      "branchDir",
      "activeTrunk",
      "branchPrefix",
      "root",
    ].map(async (key) => {
      if (data[key]) {
        const value = data[key];
        svn.log(`Updating ${key} to ${value}`);
        await config.save(key, value);
        svn.log(`Success! Updated ${key} to ${value}`);
      }
    });

    if (data.output) {
      let silent = null;
      let verbose = null;

      switch (data.output) {
        case "normal": {
          silent = false;
          verbose = false;
          break;
        }
        case "verbose": {
          silent = false;
          verbose = true;
          break;
        }
        case "silent": {
          silent = true;
          verbose = false;
          break;
        }
        default:
          break;
      }

      if (silent !== null) {
        svn.log(`Updating default output mode to ${data.mode}`);
        updates.push(
          config.save("verbose", verbose),
          config.save("silent", silent),
        );
      }
    }

    await Promise.all(updates);
  },
};

import { exec } from "node:child_process";

export class SVN {
  #opts = {};
  #debug = false;
  #config = {};
  #jira;
  constructor(config, jira) {
    this.#config = config;
    this.#debug = !!config.verbose;
    this.#jira = jira;
    this.#opts = {
      cwd: config.cwd || process.cwd(),
    };
  }

  #execute(cmd) {
    if (this.#debug) {
      console.log("[executing svn command]", cmd);
    }

    try {
      return new Promise((resolve, reject) => {
        const process = exec(
          cmd,
          (err, stdout) => {
            if (this.#debug) {
              console.log("[executed svn command]", cmd);
            }

            if (err) {
              console.log("[SVN][Error]", { err });
              reject(err);
              return;
            }

            resolve(stdout);
          },
          {
            maxBuffer: 1024 * 1024 * 100,
            ...this.#opts,
          },
        );

        if (this.#debug) {
          process.stdout.on("data", (data) => {
            console.log(`[SVN] ${data}`.replace("\n", ""));
          });
        }
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getHistory(branch = "./") {
    const cmd = `svn log --stop-on-copy ${branch}`;

    const stdout = await this.#execute(cmd);
    const results = [];
    const newLine = stdout.indexOf("\r\n") >= 0 ? "\r\n" : "\n";

    stdout
      .split(
        `------------------------------------------------------------------------${newLine}`,
      )
      .forEach((logEntry) => {
        const lines = logEntry.split(newLine);
        const [revision, user, date, length] = lines.shift().split(" | ");
        const message = lines.pop();

        results.push({
          logEntry,
          revision,
          user,
          date,
          length,
          message,
        });
      });

    return results.filter((r) => r.revision !== "");
  }

  async info(branch = "./") {
    const stdout = await this.#execute(`svn info ${branch}`);
    const newLine = stdout.indexOf("\r\n") >= 0 ? "\r\n" : "\n";
    const entries = stdout.split(newLine);
    const result = Object.fromEntries(
      entries.map((e) => e.split(":").map((p) => p.trim())),
    );

    return result;
  }

  mergeString(
    source,
    revisionFrom,
    target = "./",
    revisionTo = "HEAD",
    resolve = "p",
  ) {
    return `svn merge --accept ${resolve} -${revisionFrom}:${revisionTo} ${source} ${target}`;
  }

  merge(
    source,
    revisionFrom,
    target = "./",
    revisionTo = "HEAD",
    resolve = "p",
  ) {
    return this.#execute(
      `svn merge --accept ${resolve} -${revisionFrom}:${revisionTo} ${source} ${target}`,
    );
  }

  remove(target) {
    return this.#execute(`svn rm ${target} -m "Removing Branch"`);
  }

  async checkoutBranch(target, directory) {
    return this.#execute(`svn co ${target} ${directory} --quiet`);
  }

  async createBranch(trunk, target) {
    return this.#execute(`svn cp ${trunk} ${target} -m "Creating Branch"`);
  }

  async switch(target) {
    return this.#execute(`svn switch ${target} --quiet`);
  }

  async getBranchName(branch, checkJira = true) {
    let branchName = "";

    if (!branch) {
      const info = await this.info();
      branchName = info["Relative URL"].split("/").pop();
    } else if (branch.toString().indexOf(this.#config.prefix) === 0) {
      branchName = branch;
    } else {
      branchName = `${this.#config.prefix}-${branch}`;
    }

    if (checkJira && this.#jira.integrationActive()) {
      const jiraData = await this.#jira.getTicketInfo(branchName.split("-")[1]);

      branchName = jiraData?.branchName;

      if (jiraData.error) {
        svn.log(
          `Error occurred while searching for branch name in JIRA: ${jiraData.error}`,
        );
      }
    }

    return branchName;
  }

  async verify(branch) {
    try {
      await this.#execute(`svn ls ${branch}`);
      return true;
    } catch {
      return false;
    }
  }

  async isCurrentDirectoryValid() {
    try {
      const info = await this.info();
      const currentRoot = info["Repository Root"];
      const activeRoot = this.#config.repoRoot;

      return currentRoot === activeRoot;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  getUrls() {
    const {
      repoRoot,
      version,
      branchDir = "/branches",
      release = false,
    } = this.#config;

    const root = `${repoRoot}${branchDir}${version}.0`;
    const result = {
      root,
      trunk: `${root}/trunk`,
      dev: `${repoRoot}${branchDir}${version}.0/dev`,
      source: undefined,
    };

    if (release) {
      result.source = `${root}${branchDir}${version}.0`;
    }

    return result;
  }

  log(...args) {
    if (!this.#config?.silent) {
      console.log(...args);
    }
  }
}

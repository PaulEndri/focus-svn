import { exec } from 'node:child_process';

export class SVN {
    #opts = {};
    #debug = false;
    #config = {};

    constructor(config, debug = false) {
        this.#config = config;
        this.#debug = !!config.verbose;
        this.#opts = {
            cwd: config.cwd || process.cwd()
        };
    }

    #execute(cmd) {
        if (this.#debug) {
            console.log('[executing svn command]', cmd);
        }

        try {
            return new Promise((resolve, reject) => {
                const process = exec(cmd, (err, stdout) => {
                    if (this.#debug) {
                        console.log('[executed svn command]', cmd);
                    }

                    if (err) {
                        console.log('[SVN][Error]', { err });
                        reject(err);
                        return;
                    }
        
                    resolve(stdout);
                }, {
                    maxBuffer: 1024 * 1024 * 100,
                    ...this.#opts
                });

                if (this.#debug) {
                    process.stdout.on('data', (data) => {
                        console.log(`[SVN] ${data}`.replace("\n", ''));
                    });
                }
            });
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getHistory(branch = './') {
        const cmd = `svn log --stop-on-copy ${branch}`;
    
        const stdout = await this.#execute(cmd);
        const results = [];
        const newLine = stdout.indexOf('\r\n') >= 0 ? '\r\n' : '\n';
    
        stdout.split(`------------------------------------------------------------------------${newLine}`).forEach(logEntry => {
            const lines = logEntry.split(newLine);
            const [revision, user, date, length] = lines.shift().split(' | ');
            const message = lines.pop();
    
            results.push({
                logEntry,
                revision,
                user,
                date,
                length,
                message
            });
        });
    
        return results.filter(r => r.revision !== '');
    }
    
    async info(branch = './') {
        const stdout = await this.#execute(`svn info ${branch}`);
        const newLine = stdout.indexOf('\r\n') >= 0 ? '\r\n' : '\n';
        const entries = stdout.split(newLine);
        const result = Object.fromEntries(entries.map(e => e.split(':').map(p => p.trim())));

        return result;
    }

    mergeString(source, revisionFrom, target = './', revisionTo = 'HEAD', resolve = 'p') {
        return `svn merge --accept ${resolve} -${revisionFrom}:${revisionTo} ${source} ${target}`;
    }

    merge(source, revisionFrom, target = './', revisionTo = 'HEAD', resolve = 'p') {
        return this.#execute(`svn merge --accept ${resolve} -${revisionFrom}:${revisionTo} ${source} ${target}`);
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
    
    async switch(target,) {
        return this.#execute(`svn switch ${target} --quiet`);
    }

    async getBranchName(branch) {
        if (!branch) {
            const info = await this.info();
            return info['Relative URL'].split('/').pop();
        }
    
        if (branch.toString().indexOf(this.#config.prefix) === 0) {
            return branch;
        }
    
        return `${this.#config.prefix}-${branch}`;
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
			const info = await this.info();
			const currentRoot = info['Repository Root'];
			const activeRoot = this.#config.repoRoot;

			return currentRoot === activeRoot;
		}

    getUrls() {
        const {
            repoRoot,
            version,
            branchDir = '/branches',
            release = false
        } = this.#config;

        const root = `${repoRoot}${branchDir}${version}.0`;
        const result = {
            root,
            trunk: `${root}/trunk`,
            dev: `${repoRoot}${branchDir}${version}.0/dev`,
            source: undefined
        }
    
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

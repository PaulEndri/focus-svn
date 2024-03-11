import { executeCommand } from './helpers.js';

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
            const results = executeCommand(cmd, this.#opts);

            if (this.#debug) {
                console.log('[executed svn command]', results);
            }

            return results;
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
        const stdout = await this.#execute('svn info');
        const newLine = stdout.indexOf('\r\n') >= 0 ? '\r\n' : '\n';
        const entries = stdout.split(newLine);
        const result = Object.fromEntries(entries.map(e => e.split(':').map(p => p.trim())));

        return result;
    }

    mergeString(source, revisionFrom, target = './', revisionTo = 'HEAD') {
        return `svn merge --accept p -${revisionFrom}:${revisionTo} ${source} ${target}`;
    }

    merge(source, revisionFrom, target = './', revisionTo = 'HEAD') {
        return this.#execute(this.mergeString(source, revisionFrom, target, revisionTo));
    }
    
    remove(target) {
        return this.#execute(`svn rm ${target} -m "Removing Branch"`);
    }

    async checkoutBranch(target) {
        return this.#execute(`svn co ${target}`);
    }

    async createBranch(trunk, target) {
        return this.#execute(`svn cp ${trunk} ${target} -m "Creating Branch"`);
    }
    
    async switch(target) {
        return this.#execute(`svn switch ${target}`);
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

    getUrls() {
        const {
            focusRoot,
            version,
            branchDir = '/branches',
            release = false
        } = this.#config;

        const root = `${focusRoot}${branchDir}${version}.0`;
        const result = {
            root,
            trunk: `${root}/trunk`,
            dev: `${focusRoot}${branchDir}${version}.0/dev`,
            source: undefined
        }
    
        if (release) {
            result.source = `${root}${branchDir}${version}.0`;
        }
    
        return result;
    }

    log(...args) {
        return this.#config.log(...args);
    }
}

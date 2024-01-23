import { executeCommand } from './helpers.js';

export class SVN {
    #opts = {};
    #debug = false;

    constructor(directory, debug = false) {
        this.#debug = debug;
        this.#opts = {
            cwd: directory || process.cwd()
        };
    }

    #execute(cmd) {
        console.log('[executing svn command]', cmd);
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

    async getHistory(branch = '--stop-on-copy') {
        const cmd = `svn log ${branch}`;
    
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
    
    async localInfo() {
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

    async createBranch(trunk, target) {
        return this.#execute(`svn cp ${trunk} ${target} -m "Creating Branch"`);
    }
    
    async switch(target) {
        return this.#execute(`svn switch ${target}`);
    }
}

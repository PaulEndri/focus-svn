import { exec } from 'node:child_process';
import { activeVersion, root as focusRoot } from './constants.js';
import { SVN } from './svn.js';

export function executeCommand(cmd, opts = {}) {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(stdout);
        }, opts);
    })
}

export function getUrls(version = activeVersion, release = false) {
    const root = `${focusRoot}/branches/${version}.0`;
    const result = {
        root,
        trunk: `${root}/trunk`,
        dev: `${focusRoot}/branches/${version}.0/dev`,
        source: undefined
    }

    if (release) {
        result.source = `${root}/releases/${version}.0`;
    }

    return result;
}

export async function getBranchName(branch) {
    if (!branch) {
        const info = await (new SVN()).localInfo();
        return info['Relative URL'].split('/').pop();
    }

    if (branch.toString().indexOf('FOCUS') === 0) {
        return branch;
    }

    return `FOCUS-${branch}`;
}
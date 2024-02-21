import { exec } from 'node:child_process';

export function executeCommand(cmd, opts = {}) {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(stdout);
        }, {
            maxBuffer: 1024 * 1024 * 10,
            ...opts
        });
    })
}

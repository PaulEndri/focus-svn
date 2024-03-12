#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import commands from './commands/index.js';
import globalOptions from './lib/globals.js'
import { configMiddleware } from './lib/middleware.js';

await yargs(hideBin(process.argv))
    .usage('Usage: $0 <command> [options]')
    .scriptName('focus-svn')
    .options(globalOptions)
    .commands(commands)
    .middleware(configMiddleware)
    .parse();

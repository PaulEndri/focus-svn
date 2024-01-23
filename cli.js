#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import commands from './commands/index.js';
import globalOptions from './globals.js';

await yargs(hideBin(process.argv))
    .usage('Usage: $0 <command> [options]')
    .scriptName('focus-svn')
    .options(globalOptions)
    .commands(commands)
    .parse();

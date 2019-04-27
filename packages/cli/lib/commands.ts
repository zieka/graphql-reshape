import * as commander from 'commander';
import { interactiveMenu, modMenu } from './questions';

import * as packageContents from '../package.json';

// Rename Command
commander
  .command('mod')
  .alias('m')
  .description(`Run a schema mod`)
  .action(() => {
    modMenu();
  });

// Version Command
commander.version(packageContents.version, '-v, --version');

// Wildcard Command
commander.command('*').action(() => interactiveMenu());

// argument handling
commander.parse(process.argv);

// Handle the case where there are no arguments
const NO_COMMAND_SPECIFIED = commander.args.length === 0;

if (NO_COMMAND_SPECIFIED) {
  interactiveMenu().catch(console.error);
}

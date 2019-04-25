import * as commander from 'commander';
import { interactiveMenu } from './questions';
import { UNDER_CONSTRUCTION } from './helpers/constants';
import * as packageContents from '../package.json';

// Rename Command
commander
  .command('mod [schemaMod] [sourcePath]')
  .alias('m')
  .description(`Run a schema mod`)
  .action(async (schemaMod: string, sourcePath: string) => {
    try {
      if (!schemaMod || !sourcePath) {
        await interactiveMenu();
        return;
      }
      console.log(`${UNDER_CONSTRUCTION}\nschemaMod: ${schemaMod}\nsourcePath: ${sourcePath}`);
    } catch (err) {
      console.error(err);
    }
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

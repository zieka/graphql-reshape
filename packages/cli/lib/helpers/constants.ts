const { magenta, red } = require('chalk');

export const macOnly = (emoji: string): string => {
  return process.platform === 'darwin' ? emoji : '';
};

export const ASCII_LOGO = magenta.bold(`
    (         (        )          (
    )\\ )      )\\ )  ( /(   (      )\\ )
   (()/( (   (()/(  )\\())  )\\    (()/( (
    /(_)))\\   /(_))((_)\\((((_)(   /(_)))\\
   (_)) ((_) (_))   _((_))\\ _ )\\ (_)) ((_)
   | _ \\| __|/ __| | || |(_)_\\(_)| _ \\| __|
   |   /| _| \\__ \\ | __ | / _ \\  |  _/| _|
   |_|_\\|___||___/ |_||_|/_/ \\_\\ |_|  |___|
   ${red.bold('@graphql-reshape/cli - A tool for modifying schema')}
`);

export const LIST_TYPE = process.platform === 'win32' ? 'rawlist' : 'list';

export const QUIT = `${macOnly('🚫  ')}Exit Interactive CLI`;
export const MOD = `${macOnly('🔥  ')}Apply a graphql-reshape directive`;
export const CUSTOM_MOD = `${macOnly('💬  ')}Apply your own custom directive`;
export const VERSION = `${macOnly('✅  ')}Display version number`;
export const BACK = `${macOnly('⏪  ')}Go Back`;
export const YES = `${macOnly('✅  ')}Yes`;
export const NO = `${macOnly('⛔️  ')}No`;

export const UNDER_CONSTRUCTION = `${macOnly('🚧  ')}Under Construction`;

export const ENSURE_ARRAY = `[x(!)]! -> [x]! @ensureArray`;
export const UPPER = `String(!) -> String(!) @upper`;
export const LOWER = `String(!) -> String(!) @lower`;
export const MASK = `String(!) | Int(!) -> String! @mask(showLast: 4)`;

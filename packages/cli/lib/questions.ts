import * as inquirer from 'inquirer';
import {
  ASCII_LOGO,
  LIST_TYPE,
  MOD,
  VERSION,
  QUIT,
  BACK,
  YES,
  NO,
  ENSURE_ARRAY,
  UPPER,
  LOWER,
  MASK
} from './helpers/constants';
import * as packageContents from '../package.json';

interface Question {
  type: 'text' | 'list' | 'rawlist';
  name: string;
  message: string;
  choices?: string[] | Object[];
  default?: any;
}

const cleanPrompt = (): void => {
  console.clear();
  console.log(`\n${ASCII_LOGO}\n`);
};

const MAIN_MENU: Question[] = [
  {
    type: LIST_TYPE,
    name: 'q1',
    message: 'What would you like RESHAPE to help you with?',
    choices: [MOD, VERSION, QUIT]
  }
];

const WHICH_MOD: Question = {
  type: LIST_TYPE,
  name: 'q1',
  message: 'What transform would you like to use?',
  choices: [ENSURE_ARRAY, UPPER, LOWER, MASK]
};

const INCLUDE_DIRECTIVE_DEFINITION: Question = {
  type: LIST_TYPE,
  name: 'q1',
  message: 'Would you like the definition for the directive added to schema?',
  choices: [YES, NO]
};

const FIELD_NAMES: Question = {
  type: 'text',
  name: 'q1',
  message:
    'Specific fields? (provide comma seperated list) \nNot providing a list will apply directive to all String and Int fields.'
};

const handleMainMenu = (answers: any): any => {
  switch (answers.q1) {
    case MOD:
      return inquirer.prompt(WHICH_MOD).then(handleWhichMod);
    case VERSION:
      return console.log(packageContents.version);
    case QUIT:
      return Promise.resolve();
    default:
      return console.log('Answer not recognized');
  }
};

const handleWhichMod = (answers: any): any => {
  if (answers.q1 === QUIT) {
    return Promise.resolve();
  }
  if (answers.q1 === BACK) {
    return inquirer.prompt(MAIN_MENU).then(handleMainMenu);
  }
  return inquirer.prompt(INCLUDE_DIRECTIVE_DEFINITION).then(async (followUpAnswers: any) => {
    const includeDefinition = followUpAnswers.q1 === YES;
    switch (answers.q1) {
      case ENSURE_ARRAY:
        return (await import('./actions/use-ensure-array')).useEnsureArray({ includeDefinition }).catch(console.error);
      case UPPER:
        return (await import('./actions/use-upper')).useUpper({ includeDefinition }).catch(console.error);
      case LOWER:
        return (await import('./actions/use-lower')).useLower({ includeDefinition }).catch(console.error);
      case MASK:
        return inquirer.prompt(FIELD_NAMES).then(async (fieldsAnswers: any) => {
          const fieldNames = fieldsAnswers.q1.split(',');
          return (await import('./actions/use-mask')).useMask({ includeDefinition, fieldNames }).catch(console.error);
        });
      default:
        console.log('Answer not recognized');
        return inquirer.prompt(WHICH_MOD).then(handleWhichMod);
    }
  });
};

// root launch point
export const interactiveMenu = async (): Promise<void> => {
  cleanPrompt();
  inquirer.prompt(MAIN_MENU).then(handleMainMenu);
};

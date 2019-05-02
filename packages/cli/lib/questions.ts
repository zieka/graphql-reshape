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
  MASK,
  CUSTOM_MOD
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
    choices: [MOD, CUSTOM_MOD, VERSION, QUIT]
  }
];

const WHICH_MOD: Question = {
  type: LIST_TYPE,
  name: 'q1',
  message: 'What transform would you like to use?',
  choices: [ENSURE_ARRAY, UPPER, LOWER, MASK]
};

const FOLLOW_UP_QUESTIONS: Question[] = [
  {
    type: LIST_TYPE,
    name: 'q1',
    message: 'Would you like the definition for the directive added to schema?',
    choices: [YES, NO]
  },
  {
    type: 'text',
    name: 'q2',
    message:
      'What specific field name(s) should be affected? (Provide comma seperated list) \n⚠️  Not providing a list will apply directive to all qualifying fields'
  }
];

const CUSTOM_MOD_Q: Question[] = [
  {
    type: 'text',
    name: 'q1',
    message: 'What specific field name(s) should be affected? (Provide comma seperated list)'
  },
  {
    type: 'text',
    name: 'q2',
    message: 'Enter the directive(s) to add to these fields Example: @retry(count: 1) @authorize'
  }
];

const handleMainMenu = (answers: any): any => {
  switch (answers.q1) {
    case MOD:
      return inquirer.prompt(WHICH_MOD).then(handleWhichMod);
    case CUSTOM_MOD:
      return inquirer.prompt(CUSTOM_MOD_Q).then(handleCustomMod);
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
  return inquirer.prompt(FOLLOW_UP_QUESTIONS).then(async (followUpAnswers: any) => {
    const includeDefinition = followUpAnswers.q1 === YES;
    const fieldNames = followUpAnswers.q2.split(',').filter((field: String) => field !== '');
    console.log(fieldNames);

    switch (answers.q1) {
      case ENSURE_ARRAY:
        return (await import('./actions/use-ensure-array'))
          .useEnsureArray({ includeDefinition, fieldNames })
          .catch(console.error);

      case UPPER:
        return (await import('./actions/use-upper')).useUpper({ includeDefinition, fieldNames }).catch(console.error);

      case LOWER:
        return (await import('./actions/use-lower')).useLower({ includeDefinition, fieldNames }).catch(console.error);

      case MASK:
        return (await import('./actions/use-mask')).useMask({ includeDefinition, fieldNames }).catch(console.error);

      default:
        console.log('Answer not recognized');
        return inquirer.prompt(WHICH_MOD).then(handleWhichMod);
    }
  });
};

const handleCustomMod = async (answers: any): Promise<any> => {
  return (await import('./actions/use-apply-directive-to-field'))
    .useDirectiveToFieldTransformer({ fieldNames: answers.q1, directive: answers.q2 })
    .catch(console.error);
};

// root launch point
export const interactiveMenu = async (): Promise<void> => {
  cleanPrompt();
  inquirer.prompt(MAIN_MENU).then(handleMainMenu);
};

export const modMenu = async (): Promise<void> => {
  cleanPrompt();
  inquirer.prompt(WHICH_MOD).then(handleWhichMod);
};

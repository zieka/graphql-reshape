// Adds @ensureArray directive to all non nullable lists
// [things!]! -> [things!]! @ensureArray
import { print, DocumentNode } from 'graphql';
import * as path from 'path';
import * as fs from 'fs';
import globby from 'globby';
import * as chalk from 'chalk';

const { green } = chalk as any;
const cwd = process.cwd();

type ReshapeTransformer = (schema: string, options: any) => [string | DocumentNode, boolean];

export const useTransformer = async (transformer: ReshapeTransformer, options = {}): Promise<boolean> => {
  /**
   * Gathers the .graphql files and adds ensureArray directive to non nullable lists
   * @param {*} file
   */
  const read = async (file: string): Promise<any> => {
    return new Promise(
      (resolve: any): void => {
        const fileStream = fs.createReadStream(file, { encoding: 'utf8' });
        fileStream.on('data', (data: any) => {
          // clean the file path so it is relative to project for ease of reading
          const [newAST, addedDirective] = transformer(data, options);
          if (addedDirective) {
            const newData = new Uint8Array(Buffer.from(print(newAST)));
            fs.writeFile(file, newData, (err: NodeJS.ErrnoException) => {
              if (err) {
                throw err;
              }
              const shortFilePath = file.replace(cwd, '');
              // notify console that this file is being changed
              console.log(green(shortFilePath));
            });
          }
        });

        fileStream.on('close', () => {
          resolve(true);
        });
      }
    );
  };
  // gather graphql files
  const filePaths = await globby([
    path.join(cwd, '/**/*.graphql'),
    `!${path.join(cwd, 'dist')}`,
    `!${path.join(cwd, 'node_modules')}`
  ]);
  // read each file and transform if needed
  filePaths.forEach(read);
  return true;
};

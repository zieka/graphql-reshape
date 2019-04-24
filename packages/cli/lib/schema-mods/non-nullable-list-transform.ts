// This codemod transforms all nullable lists of non-nullable things to a non-nullable list
// [things!] -> [things!]!

import {
  parse,
  print,
  visit,
  ASTNode,
  ListTypeNode,
  InputValueDefinitionNode,
  FieldDefinitionNode,
  Kind
} from 'graphql';
import * as path from 'path';
import * as fs from 'fs';
import * as globby from 'globby';
import * as chalk from 'chalk';

const { green } = chalk as any;
const cwd = process.cwd();

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

// walks AST to find field definitions that are nullable lists [x] and  makes them non null [x]!
const nullableListtoNonNull = (AST: ASTNode, fileName: string): [ASTNode, boolean] => {
  let changedList = false;

  const enter = (node: InputValueDefinitionNode | FieldDefinitionNode): any => {
    // if the node is a list containing non nullable types
    if (node.type.kind === Kind.LIST_TYPE && node.type.type.kind !== Kind.NON_NULL_TYPE) {
      changedList = true;
      return undefined;
    }
    // by default skip node
    return false;
  };
  const leave = (node: InputValueDefinitionNode | FieldDefinitionNode): any => {
    const currentListNode = node.type as ListTypeNode;
    const final: Mutable<ASTNode> = { ...node };
    final.type = { kind: Kind.NON_NULL_TYPE, type: currentListNode };
    return final;
  };

  const newAST = visit(AST, {
    FieldDefinition: {
      enter,
      leave
    }
  });

  return [newAST, changedList];
};

export const nullableListtoNonNullMod = async (): Promise<boolean> => {
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
          const shortFilePath = file.replace(cwd, '');
          const fileAsAST = parse(data);
          const [newAST, changedList] = nullableListtoNonNull(fileAsAST, shortFilePath);
          if (changedList) {
            const newData = new Uint8Array(Buffer.from(print(newAST)));
            fs.writeFile(file, newData, (err: NodeJS.ErrnoException) => {
              if (err) {
                throw err;
              }
              // notify console that this file is being changed
              console.log(green(shortFilePath));
            });
          }
        });

        fileStream.on('close', () => {
          resolve();
        });
      }
    );
  };
  const filePaths = await globby([
    path.join(cwd, '/**/*.graphql'),
    `!${path.join(cwd, 'dist')}`,
    `!${path.join(cwd, 'node_modules')}`
  ]);
  filePaths.forEach(read);
  return true;
};

import { DocumentNode, parse, ASTNode } from 'graphql';
import {
  Kind,
  visit,
  DirectiveDefinitionNode,
  DirectiveNode,
  FieldDefinitionNode,
  Visitor,
  ASTKindToNode
} from 'graphql/language';
import { TransformerOutput, hasDirective } from '../helpers';

/**
 * Transforms: [x]! -> [x]! @ensureArray
 * @param schema schema definition language
 * @param includeDefinition line defining ensureArray
 */
export const ensureArrayTransformer = (schema: string, includeDefinition: boolean = true): TransformerOutput => {
  let ast;
  let addedDirective = false;

  // attempt to parse and if its not parsable lets just return the original
  try {
    ast = parse(schema, { noLocation: true });
  } catch (e) {
    return [schema, false];
  }

  // represents the "@ensureArray" as an AST node
  const ensureArrayAsAST: DirectiveNode = {
    kind: Kind.DIRECTIVE,
    name: {
      kind: Kind.NAME,
      value: 'ensureArray'
    },
    arguments: []
  };

  // represents the "directive @ensureArray on FIELD_DEFINITION" as an AST node
  const directiveDef: DirectiveDefinitionNode = {
    kind: Kind.DIRECTIVE_DEFINITION,
    name: {
      kind: Kind.NAME,
      value: 'ensureArray'
    },
    arguments: [],
    locations: [{ kind: Kind.NAME, value: 'FIELD_DEFINITION' }]
  };

  // when we walk the AST this visitor defines where we stop and what we do at each node
  const visitor: Visitor<ASTKindToNode, ASTNode> = {
    [Kind.FIELD_DEFINITION]: {
      enter: (node: FieldDefinitionNode): any => {
        if (
          node.type.kind === Kind.NON_NULL_TYPE &&
          node.type.type.kind === Kind.LIST_TYPE &&
          !hasDirective('ensureArray', node)
        ) {
          // if field is defined as [x]! and does not already have upper directive skip node else enter node
          return undefined;
        } else {
          // skip the node
          return false;
        }
      },
      leave: (node: FieldDefinitionNode): any => {
        // exiting the node we want to replace this node with the same node but with our ensureArray added to the directives
        addedDirective = true;
        const originalDirectives = (Array.isArray(node.directives) && node.directives) || [];
        return {
          ...node,
          ...{ directives: [ensureArrayAsAST, ...originalDirectives] }
        };
      }
    }
  };

  // include the definition if desired add this to our visitor
  if (includeDefinition) {
    visitor[Kind.DOCUMENT] = {
      enter: (): any => undefined,
      leave: (node: DocumentNode): any => {
        const originalDefinitions = (Array.isArray(node.definitions) && node.definitions) || [];
        return { ...node, definitions: [directiveDef, ...originalDefinitions] };
      }
    };
  }

  const newAST: DocumentNode = visit(ast, visitor);
  return [newAST, addedDirective];
};

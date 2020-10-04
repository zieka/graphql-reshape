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

const defaultOptions = {
  includeDefinition: false,
  fieldNames: [] as String[]
};

export type LowerTransformerOptions = Partial<typeof defaultOptions>;

/**
 * Transforms: String -> String @lower
 * @param schema schema definition language
 * @param userOptions
 */
export const lowerTransformer = (schema: string, userOptions: LowerTransformerOptions = {}): TransformerOutput => {
  const options = { ...defaultOptions, ...userOptions };
  let ast;
  let addedDirective = false;

  // attempt to parse and if its not parsable lets just return the original
  try {
    ast = parse(schema, { noLocation: true });
  } catch (e) {
    return [schema, false];
  }

  // represents the "@lower" as an AST node
  const lowerAsAST: DirectiveNode = {
    kind: Kind.DIRECTIVE,
    name: {
      kind: Kind.NAME,
      value: 'lower'
    },
    arguments: []
  };

  // represents the "directive @lower on FIELD_DEFINITION" as an AST node
  const directiveDef: DirectiveDefinitionNode = {
    kind: Kind.DIRECTIVE_DEFINITION,
    name: {
      kind: Kind.NAME,
      value: 'lower'
    },
    arguments: [],
    locations: [{ kind: Kind.NAME, value: 'FIELD_DEFINITION' }],
    repeatable: false
  };

  // when we walk the AST this visitor defines where we stop and what we do at each node
  const visitor: Visitor<ASTKindToNode, ASTNode> = {
    [Kind.FIELD_DEFINITION]: {
      enter: (node: FieldDefinitionNode): any => {
        if (options.fieldNames.includes(node.name.value) && !hasDirective('lower', node)) {
          // only add directive to specific fields
          return undefined;
        }
        if (options.fieldNames.length > 0) {
          // if there are fieldNames they should have been handled before this so at this point we can exit
          return false;
        }
        if (node.type.kind === Kind.NAMED_TYPE && node.type.name.value === 'String' && !hasDirective('lower', node)) {
          // if field is defined as String and does not already have lower directive skip node else enter node
          return undefined;
        } else if (
          node.type.kind === Kind.NON_NULL_TYPE &&
          node.type.type.kind === Kind.NAMED_TYPE &&
          node.type.type.name.value === 'String' &&
          !hasDirective('lower', node)
        ) {
          // if field is defined as String! and does not already have lower directive skip node else enter node
          return undefined;
        } else {
          // skip the node
          return false;
        }
      },
      leave: (node: FieldDefinitionNode): any => {
        // exiting the node we want to replace this node with the same node but with our lower added to the directives
        addedDirective = true;
        const originalDirectives = (Array.isArray(node.directives) && node.directives) || [];
        return {
          ...node,
          ...{ directives: [lowerAsAST, ...originalDirectives] }
        };
      }
    }
  };

  // include the definition if desired add this to our visitor
  if (options.includeDefinition) {
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

import { DocumentNode, parse, ASTNode } from 'graphql';
import { Kind, visit, DirectiveNode, FieldDefinitionNode, Visitor, ASTKindToNode } from 'graphql/language';
import { TransformerOutput, directiveAsAst } from '../helpers';

const defaultOptions = {
  directive: '',
  fieldNames: [] as String[]
};

export type ApplyDirectiveToFieldTransformerOptions = typeof defaultOptions;
/**
 * @param schema schema definition language
 * @param userOptions
 */
export const applyDirectiveToFieldTransformer = (
  schema: string,
  userOptions: ApplyDirectiveToFieldTransformerOptions = defaultOptions
): TransformerOutput => {
  const options = { ...defaultOptions, ...userOptions };
  let ast;
  let addedDirective = false;

  // attempt to parse and if its not parsable lets just return the original
  try {
    ast = parse(schema, { noLocation: true });
  } catch (e) {
    return [schema, false];
  }

  // represents the directive as an AST node
  const applyDirectiveToFieldAsAST: DirectiveNode[] = directiveAsAst(options.directive);

  // when we walk the AST this visitor defines where we stop and what we do at each node
  const visitor: Visitor<ASTKindToNode, ASTNode> = {
    [Kind.FIELD_DEFINITION]: {
      enter: (node: FieldDefinitionNode): any => {
        if (options.fieldNames.includes(node.name.value)) {
          // only add directive to specific fields
          return undefined;
        }
        if (options.fieldNames.length > 0) {
          // if there are fieldNames they should have been handled before this so at this point we can exit
          return false;
        } else {
          // skip the node
          return false;
        }
      },
      leave: (node: FieldDefinitionNode): any => {
        // exiting the node we want to replace this node with the same node but with our applyDirectiveToField added to the directives
        addedDirective = true;
        const originalDirectives: DirectiveNode[] = (Array.isArray(node.directives) && node.directives) || [];
        return {
          ...node,
          ...{ directives: [...originalDirectives, ...applyDirectiveToFieldAsAST] }
        };
      }
    }
  };

  const newAST: DocumentNode = visit(ast, visitor);
  return [newAST, addedDirective];
};

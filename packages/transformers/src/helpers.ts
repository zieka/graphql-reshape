import { DocumentNode, ASTNode, print, parse } from 'graphql';
import { Kind, FieldDefinitionNode, DirectiveDefinitionNode } from 'graphql/language';

export const isNode = (maybeNode: any): maybeNode is ASTNode => {
  return maybeNode && typeof maybeNode.kind === 'string';
};

export const isDocumentNode = (node: ASTNode): node is DocumentNode => {
  return isNode(node) && node.kind === Kind.DOCUMENT;
};

export const normalizeSchema = (target: DocumentNode | string): string => {
  if (isDocumentNode(target as DocumentNode)) {
    return print(target);
  }
  if (typeof target === 'string') {
    return print(parse(target, { noLocation: true }));
  }
  return '';
};

export type TransformerOutput = [DocumentNode | string, boolean];

export const hasDirective = (targetDirective: string, node: FieldDefinitionNode): boolean => {
  return (
    Array.isArray(node.directives) &&
    node.directives.some(
      (directive: DirectiveDefinitionNode): boolean => {
        return directive.name.value === targetDirective;
      }
    )
  );
};

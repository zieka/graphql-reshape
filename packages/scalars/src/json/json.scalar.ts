import { GraphQLScalarType, ASTNode } from 'graphql';
import { Kind } from 'graphql/language';

function identity(value: any) {
  return value;
}

function parseLiteral(ast: ASTNode, variables: any): any {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT: {
      const value = Object.create(null);
      ast.fields.forEach((field) => {
        value[field.name.value] = parseLiteral(field.value, variables);
      });

      return value;
    }
    case Kind.LIST:
      return ast.values.map((n) => parseLiteral(n, variables));
    case Kind.NULL:
      return null;
    case Kind.VARIABLE: {
      const name = ast.name.value;
      return variables ? variables[name] : undefined;
    }
    default:
      return undefined;
  }
}

export const JSON = new GraphQLScalarType({
  name: 'JSON',
  description: 'Represents JSON values',
  serialize: identity,
  parseValue: identity,
  parseLiteral
});

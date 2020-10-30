import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

export const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime();
    }
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  }
});

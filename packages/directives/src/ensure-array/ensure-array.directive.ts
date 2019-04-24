import { GraphQLField, defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

export class EnsureArrayDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>): void {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (...args: any[]): Promise<any[]> => {
      const result = await resolve.apply(this, args);
      if (!Array.isArray(result)) {
        return [];
      }
      return result;
    };
  }
}

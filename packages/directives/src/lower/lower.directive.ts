import { GraphQLField, defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

export class LowerCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>): void {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args: any[]): Promise<string> {
      const result = await resolve.apply(this, args);
      if (typeof result === 'string') {
        return result.toLowerCase();
      }
      return result;
    };
  }
}

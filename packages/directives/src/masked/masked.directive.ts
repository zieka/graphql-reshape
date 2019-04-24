import { GraphQLField, defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

export class MaskedCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>): void {
    const { resolve = defaultFieldResolver } = field;
    const { showLast } = this.args;
    field.resolve = async (...args: any[]): Promise<string> => {
      const result = await resolve.apply(this, args);
      // make sure target is a string
      const target = typeof result === 'number' ? String(result) : typeof result === 'string' ? result : null;
      // if target is not a string then return the original result
      return target ? target.slice(-showLast).padStart(target.length, '*') : result;
    };
  }
}

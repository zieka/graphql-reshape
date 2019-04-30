import { GraphQLField, defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

export class MaskedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>): void {
    const { resolve = defaultFieldResolver } = field;
    const { showLast } = this.args;
    field.resolve = async (...args: any[]): Promise<string> => {
      const result = await resolve.apply(this, args);
      // make sure target is a string or number
      const target = typeof result === 'number' ? String(result) : typeof result === 'string' ? result : '';
      // return the masked string
      return target.slice(-showLast).padStart(target.length, '*');
    };
  }
}

import { ensureArrayTransformer } from './ensure-array.transformer';
import { DocumentNode } from 'graphql';
import { isDocumentNode, normalizeSchema } from '../helpers';

describe('ensureArrayTransformer', () => {
  it('should return original string if not parsable', () => {
    // Arrange
    const fixture = 'some string that is not a schema definition language (SDL)';
    // Act
    const result = ensureArrayTransformer(fixture);
    // Assert
    expect(result[0]).toEqual(fixture);
  });
  it('should return a DocumentNode if parsable', () => {
    // Arrange
    const fixture = `
        enum size {
            BIG
            SMALL
        }
        type cat {
            size: size
        }
        `;
    // Act
    const result = ensureArrayTransformer(fixture);
    // Assert
    expect(isDocumentNode(result[0] as DocumentNode)).toEqual(true);
  });
  it('should add ensureArray directives to non-nullable lists', () => {
    // Arrange
    const fixture = `
            type thing {
                prop1: [Int]
                prop2: [Int!]
                prop3: [Int]!
                prop4: [Int!]!
            }
        `;
    // Act
    const result = ensureArrayTransformer(fixture);
    // Assert
    const expectedSchema = `
            type thing {
                prop1: [Int]
                prop2: [Int!]
                prop3: [Int]! @ensureArray
                prop4: [Int!]! @ensureArray
            }
        `;
    expect(normalizeSchema(result[0])).toEqual(normalizeSchema(expectedSchema));
  });
  it('should add directive definition if option is on', () => {
    // Arrange
    const fixture = `
            type thing {
                prop1: [Int]
                prop2: [Int!]
                prop3: [Int]!
                prop4: [Int!]!
            }
        `;
    // Act
    const result = ensureArrayTransformer(fixture, { includeDefinition: true });
    // Assert
    const expectedSchema = `
            directive @ensureArray on FIELD_DEFINITION
            type thing {
                prop1: [Int]
                prop2: [Int!]
                prop3: [Int]! @ensureArray
                prop4: [Int!]! @ensureArray
            }
        `;
    expect(normalizeSchema(result[0])).toEqual(normalizeSchema(expectedSchema));
  });
  it('should add directive definition only to specificed fields', () => {
    // Arrange
    const fixture = `
            type thing {
              prop1: String
              prop2: String!
              prop3: Int
              prop4: Int!
              prop5: [String]
              prop6: [String]!
            }
        `;
    // Act
    const result = ensureArrayTransformer(fixture, { fieldNames: ['prop1', 'prop4'] });
    // Assert
    const expectedSchema = `
            type thing {
              prop1: String @ensureArray
              prop2: String!
              prop3: Int
              prop4: Int! @ensureArray
              prop5: [String]
              prop6: [String]!
            }
        `;
    expect(normalizeSchema(result[0])).toEqual(normalizeSchema(expectedSchema));
  });
});

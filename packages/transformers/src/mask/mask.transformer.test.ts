import { maskTransformer } from './mask.transformer';
import { DocumentNode } from 'graphql';
import { isDocumentNode, normalizeSchema } from '../helpers';

describe('maskTransformer', () => {
  it('should return original string if not parsable', () => {
    // Arrange
    const fixture = 'some string that is not a schema definition language (SDL)';
    // Act
    const result = maskTransformer(fixture);
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
    const result = maskTransformer(fixture);
    // Assert
    expect(isDocumentNode(result[0] as DocumentNode)).toEqual(true);
  });
  it('should add mask directives to strings', () => {
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
    const result = maskTransformer(fixture);
    // Assert
    const expectedSchema = `
            type thing {
              prop1: String @mask(showLast: 4)
              prop2: String! @mask(showLast: 4)
              prop3: Int @mask(showLast: 4)
              prop4: Int! @mask(showLast: 4)
              prop5: [String]
              prop6: [String]!
            }
        `;
    expect(normalizeSchema(result[0])).toEqual(normalizeSchema(expectedSchema));
  });
  it('should add directive definition if option is on', () => {
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
    const result = maskTransformer(fixture, { includeDefinition: true });
    // Assert
    const expectedSchema = `
            directive @mask(showLast: Int = 4) on FIELD_DEFINITION
            type thing {
              prop1: String @mask(showLast: 4)
              prop2: String! @mask(showLast: 4)
              prop3: Int @mask(showLast: 4)
              prop4: Int! @mask(showLast: 4)
              prop5: [String]
              prop6: [String]!
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
    const result = maskTransformer(fixture, { fieldNames: ['prop1', 'prop4'] });
    // Assert
    const expectedSchema = `
            type thing {
              prop1: String @mask(showLast: 4)
              prop2: String!
              prop3: Int
              prop4: Int! @mask(showLast: 4)
              prop5: [String]
              prop6: [String]!
            }
        `;
    expect(normalizeSchema(result[0])).toEqual(normalizeSchema(expectedSchema));
  });
});

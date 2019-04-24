import { upperTransformer } from './upper.transformer';
import { DocumentNode } from 'graphql';
import { isDocumentNode, normalizeSchema } from '../helpers';

describe('upperTransformer', () => {
  it('should return original string if not parsable', () => {
    // Arrange
    const fixture = 'some string that is not a schema definition language (SDL)';
    // Act
    const result = upperTransformer(fixture);
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
    const result = upperTransformer(fixture);
    // Assert
    expect(isDocumentNode(result[0] as DocumentNode)).toEqual(true);
  });
  it('should add upper directives to strings', () => {
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
    const result = upperTransformer(fixture);
    // Assert
    const expectedSchema = `
            type thing {
              prop1: String @upper
              prop2: String! @upper
              prop3: Int
              prop4: Int!
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
    const result = upperTransformer(fixture, true);
    // Assert
    const expectedSchema = `
    directive @upper on FIELD_DEFINITION
            type thing {
              prop1: String @upper
              prop2: String! @upper
              prop3: Int
              prop4: Int!
              prop5: [String]
              prop6: [String]!
            }
        `;
    expect(normalizeSchema(result[0])).toEqual(normalizeSchema(expectedSchema));
  });
});

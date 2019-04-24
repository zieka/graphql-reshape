import { lowerTransformer } from './lower.transformer';
import { DocumentNode } from 'graphql';
import { isDocumentNode, normalizeSchema } from '../helpers';

describe('lowerTransformer', () => {
  it('should return original string if not parsable', () => {
    // Arrange
    const fixture = 'some string that is not a schema definition language (SDL)';
    // Act
    const result = lowerTransformer(fixture);
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
    const result = lowerTransformer(fixture);
    // Assert
    expect(isDocumentNode(result[0] as DocumentNode)).toEqual(true);
  });
  it('should add lower directives to strings', () => {
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
    const result = lowerTransformer(fixture);
    // Assert
    const expectedSchema = `
            type thing {
              prop1: String @lower
              prop2: String! @lower
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
    const result = lowerTransformer(fixture, true);
    // Assert
    const expectedSchema = `
    directive @lower on FIELD_DEFINITION
            type thing {
              prop1: String @lower
              prop2: String! @lower
              prop3: Int
              prop4: Int!
              prop5: [String]
              prop6: [String]!
            }
        `;
    expect(normalizeSchema(result[0])).toEqual(normalizeSchema(expectedSchema));
  });
});

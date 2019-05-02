import { applyDirectiveToFieldTransformer } from './apply-directive-to-field.transformer';
import { DocumentNode } from 'graphql';
import { isDocumentNode, normalizeSchema } from '../helpers';

describe('applyDirectiveToFieldTransformer', () => {
  it('should return original string if not parsable', () => {
    // Arrange
    const fixture = 'some string that is not a schema definition language (SDL)';
    // Act
    const result = applyDirectiveToFieldTransformer(fixture);
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
    const result = applyDirectiveToFieldTransformer(fixture);
    // Assert
    expect(isDocumentNode(result[0] as DocumentNode)).toEqual(true);
  });
  it('should add directive only to specificed fields', () => {
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
    const result = applyDirectiveToFieldTransformer(fixture, {
      directive: '@someDirective',
      fieldNames: ['prop1', 'prop4']
    });
    // Assert
    const expectedSchema = `
            type thing {
              prop1: String @someDirective
              prop2: String!
              prop3: Int
              prop4: Int! @someDirective
              prop5: [String]
              prop6: [String]!
            }
        `;
    expect(normalizeSchema(result[0])).toEqual(normalizeSchema(expectedSchema));
  });
  it('should add directive with arguments only to specificed fields', () => {
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
    const result = applyDirectiveToFieldTransformer(fixture, {
      directive: '@someDirective(test: 4)',
      fieldNames: ['prop2', 'prop5']
    });
    // Assert
    const expectedSchema = `
            type thing {
              prop1: String
              prop2: String! @someDirective(test: 4)
              prop3: Int
              prop4: Int!
              prop5: [String] @someDirective(test: 4)
              prop6: [String]!
            }
        `;
    expect(normalizeSchema(result[0])).toEqual(normalizeSchema(expectedSchema));
  });
  it('should add multiple directives only to specificed fields', () => {
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
    const result = applyDirectiveToFieldTransformer(fixture, {
      directive: '@someDirective(test: 4) @someOtherDirective(some: "thing")',
      fieldNames: ['prop2', 'prop3', 'prop5']
    });
    // Assert
    const expectedSchema = `
            type thing {
              prop1: String
              prop2: String! @someDirective(test: 4) @someOtherDirective(some: "thing")
              prop3: Int @someDirective(test: 4) @someOtherDirective(some: "thing")
              prop4: Int!
              prop5: [String] @someDirective(test: 4) @someOtherDirective(some: "thing")
              prop6: [String]!
            }
        `;
    expect(normalizeSchema(result[0])).toEqual(normalizeSchema(expectedSchema));
  });
  it('should not add anything if directive is not parsable', () => {
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
    const result = applyDirectiveToFieldTransformer(fixture, {
      directive: 'thisShouldFail',
      fieldNames: ['prop2', 'prop3', 'prop5']
    });
    // Assert
    const expectedSchema = `
            type thing {
              prop1: String
              prop2: String!
              prop3: Int
              prop4: Int!
              prop5: [String]
              prop6: [String]!
            }
        `;
    expect(normalizeSchema(result[0])).toEqual(normalizeSchema(expectedSchema));
  });
  it('should not affect existing directives on fields', () => {
    // Arrange
    const fixture = `
            type thing {
              prop1: String @old
              prop2: String! @old
              prop3: Int
              prop4: Int!
              prop5: [String]
              prop6: [String]!
            }
        `;
    // Act
    const result = applyDirectiveToFieldTransformer(fixture, {
      directive: '@additionalDirective',
      fieldNames: ['prop2']
    });
    // Assert
    const expectedSchema = `
            type thing {
              prop1: String @old
              prop2: String! @old @additionalDirective
              prop3: Int
              prop4: Int!
              prop5: [String]
              prop6: [String]!
            }
        `;
    expect(normalizeSchema(result[0])).toEqual(normalizeSchema(expectedSchema));
  });
});

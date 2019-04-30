# @graphql-reshape/directives

<p align="center"><img src="https://github.com/zieka/graphql-reshape/raw/master/graphql-reshape-logo.svg?sanitize=true" width="300px" alt="GraphQL Reshape Logo"></p>

## How to install

```
npm i @graphql-reshape/directives
```

## How to use

1. Import the directive you would like to use in your schema and using Apollo's `makeExecutableSchema()` add the directive to the schemaDirectives:

   ```ts
   import { MaskedDirective } from '@graphql-reshape/directives';

   const schema = makeExecutableSchema({
     typeDefs,
     schemaDirectives: {
       masked: MaskedDirective
     }
   });
   ```

2. Add the directive schema definition to your schema and use the directive:

   ```graphql
   directive @masked(showLast: Int = 4) on FIELD_DEFINITION

   type Person {
     name: String!
     dateOfBirth: String! @masked(showLast: 2)
   }
   ```

   OR alternatively you can use the `@graphql-reshape/cli` to apply definitions and directives to your schema with ease.

# `@graphql-reshape/transformers`

<p align="center"><img src="https://github.com/zieka/graphql-reshape/raw/master/graphql-reshape-logo.svg?sanitize=true" width="300px" alt="GraphQL Reshape Logo"></p>

## How to install

```
npm i -g @graphql-reshape/transformers
```

## string -> [DocumentNode | string , boolean]

### What is a transformer in this context?

A transformer is a function that takes in a graphql schema definition language (SDL) as a string and returns an array where the first element is the parsed schema or original string if not parsable and the second element is a boolean representing if the transform changed anything.

A transformer also can take an optional second argument which is an object that holds specific options for the transformer

## How to use

Import the transformer directly and apply call it with a graphl schema (`DocumentNode | string`). This will return a parsed schema AST with the directive added. Typically you can then print the `DocumentNode` if you wanted to get back to the graphl schema definition language or you can pass the parsed `DocumentNode` to some function that can consume it like Apollo's `makeExecutableSchema()`

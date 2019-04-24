# `@graphql-reshape/transformers`

## How to install

```
npm i -g @graphql-reshape/transformers
```

## string -> [DocumentNode | string , boolean]

### What is a transformer in this context?

A transformer is a function that takes in a graphql schema definition language (SDL) as a string and returns an array where the first element is the parsed schema or original string if not parsable and the second element is a boolean representing if the transform changed anything.

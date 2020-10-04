# `@graphql-reshape/scalars`

<p align="center" style="margin-top: 3rem;"><img src="https://github.com/zieka/graphql-reshape/raw/master/graphql-reshape-logo.svg?sanitize=true" width="300px" alt="GraphQL Reshape Logo"></p>

## How to install

```
npm i @graphql-reshape/scalars
```

### What is a custom scalar?

The GraphQL specification has the following scalars types:
 - `Int`
 - `Float`
 - `String`
 - `Boolean`
 - `ID`

Custom scalars extend this to include other common types and/or validations.


## How to use

Add a custom resolver mapping for the scalar being used.

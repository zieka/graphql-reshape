import { useTransformer } from '../helpers/use-transform';
import { upperTransformer } from '@graphql-reshape/transformers/src/upper/upper.transformer';

export const useUpper = (includeDefinition: boolean) => useTransformer(upperTransformer, includeDefinition);

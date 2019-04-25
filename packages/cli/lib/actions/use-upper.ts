import { useTransformer } from '../helpers/use-transform';
import { upperTransformer } from '@graphql-reshape/transformers';

export const useUpper = (includeDefinition: boolean) => useTransformer(upperTransformer, includeDefinition);

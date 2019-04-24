import { useTransformer } from '../helpers/use-transform';
import { ensureArrayTransformer } from '@graphql-reshape/transformers';

export const useEnsureArray = (includeDefinition: boolean) => useTransformer(ensureArrayTransformer, includeDefinition);

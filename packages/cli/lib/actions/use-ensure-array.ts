import { useTransformer } from '../helpers/use-transform';
import { ensureArrayTransformer } from '@graphql-reshape/transformers/src/ensure-array/ensure-array.transformer';

export const useEnsureArray = (includeDefinition: boolean) => useTransformer(ensureArrayTransformer, includeDefinition);

import { useTransformer } from '../helpers/use-transform';
import { ensureArrayTransformer } from '@graphql-reshape/transformers';

interface Options {
  includeDefinition?: boolean;
  fieldNames?: String[];
}

export const useEnsureArray = (userOptions: Options) => useTransformer(ensureArrayTransformer, userOptions);

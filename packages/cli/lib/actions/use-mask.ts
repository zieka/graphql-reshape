import { useTransformer } from '../helpers/use-transform';
import { maskTransformer } from '@graphql-reshape/transformers';

interface Options {
  includeDefinition?: boolean;
  fieldNames?: String[];
}

export const useMask = (userOptions: Options) => useTransformer(maskTransformer, userOptions);

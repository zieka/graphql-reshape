import { useTransformer } from '../helpers/use-transform';
import { upperTransformer } from '@graphql-reshape/transformers';

interface Options {
  includeDefinition?: boolean;
  fieldNames?: String[];
}

export const useUpper = (userOptions: Options) => useTransformer(upperTransformer, userOptions);

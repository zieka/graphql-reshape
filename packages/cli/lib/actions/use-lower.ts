import { useTransformer } from '../helpers/use-transform';
import { lowerTransformer } from '@graphql-reshape/transformers';

interface Options {
  includeDefinition?: boolean;
  fieldNames?: String[];
}

export const useLower = (userOptions: Options) => useTransformer(lowerTransformer, userOptions);

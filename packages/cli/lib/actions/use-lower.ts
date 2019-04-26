import { useTransformer } from '../helpers/use-transform';
import { lowerTransformer } from '@graphql-reshape/transformers';

interface Options {
  includeDefinition?: boolean;
}

export const useLower = (userOptions: Options) => useTransformer(lowerTransformer, userOptions);

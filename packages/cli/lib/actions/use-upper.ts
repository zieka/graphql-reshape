import { useTransformer } from '../helpers/use-transform';
import { upperTransformer } from '@graphql-reshape/transformers';

interface Options {
  includeDefinition?: boolean;
}

export const useUpper = (userOptions: Options) => useTransformer(upperTransformer, userOptions);

import { useTransformer } from '../helpers/use-transform';
import { lowerTransformer } from '@graphql-reshape/transformers';

export const useLower = (includeDefinition: boolean) => useTransformer(lowerTransformer, includeDefinition);

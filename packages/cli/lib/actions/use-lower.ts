import { useTransformer } from '../helpers/use-transform';
import { lowerTransformer } from '@graphql-reshape/transformers/src/lower/lower.transformer';

export const useLower = (includeDefinition: boolean) => useTransformer(lowerTransformer, includeDefinition);

import { useTransformer } from '../helpers/use-transform';
import { applyDirectiveToFieldTransformer } from '@graphql-reshape/transformers';

interface Options {
  fieldNames: String[];
  directive: String;
}

export const useDirectiveToFieldTransformer = (userOptions: Options) =>
  useTransformer(applyDirectiveToFieldTransformer, userOptions);

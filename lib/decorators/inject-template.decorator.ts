import { getTemplateToken } from '../helpers/token.helper';
import { Inject } from '@nestjs/common';

export const InjectJsrTemplate = (name?: string): ParameterDecorator =>
  Inject(getTemplateToken(name));

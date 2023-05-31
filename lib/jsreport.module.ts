import { DynamicModule, Module } from '@nestjs/common';
import { JSREPORT_ROOT_OPTIONS_TOKEN } from './constants';
import { JsReportInstanceOptions } from './interfaces/instance.options';
import {
  getTemplateOptionsToken,
  getTemplateToken,
} from './helpers/token.helper';
import { getJsReportInstanceProvider } from './providers/instance.provider';
import { JsReportTemplateOptions } from './interfaces/template.options';
import { getTemplateProvider } from './providers/template.provider';
import { JSREPORT_INSTANCE_TOKEN } from './constants';

@Module({})
export class JsReportModule {
  static forRoot(options: JsReportInstanceOptions): DynamicModule {
    return {
      global: true,
      module: JsReportModule,
      providers: [
        {
          provide: JSREPORT_ROOT_OPTIONS_TOKEN,
          useValue: options,
        },
        getJsReportInstanceProvider(options),
      ],
      exports: [JSREPORT_INSTANCE_TOKEN],
    };
  }

  static registerTemplate(options: JsReportTemplateOptions): DynamicModule {
    return {
      module: JsReportModule,
      providers: [
        {
          provide: getTemplateOptionsToken(options.name),
          useValue: options,
        },
        getTemplateProvider(options),
      ],
      exports: [getTemplateToken(options.name)],
    };
  }
}

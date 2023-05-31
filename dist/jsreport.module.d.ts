import { DynamicModule } from '@nestjs/common';
import { JsReportInstanceOptions } from './interfaces/instance.options';
import { JsReportTemplateOptions } from './interfaces/template.options';
export declare class JsReportModule {
    static forRoot(options: JsReportInstanceOptions): DynamicModule;
    static registerTemplate(options: JsReportTemplateOptions): DynamicModule;
}

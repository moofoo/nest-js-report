import { JsReportTemplate, Asset } from '../types';
export interface JsReportTemplateOptions {
    name: string;
    folder?: string;
    initialize?: boolean;
    template: JsReportTemplate;
    assets?: Asset[];
    scripts?: Asset[];
}

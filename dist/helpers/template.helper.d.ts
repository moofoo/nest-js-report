import { Reporter } from 'jsreport-core';
import { JsReportTemplate } from '../types';
export declare class TemplateHelper {
    private readonly jsReport;
    constructor(jsReport: Reporter);
    stored(name: string): Promise<boolean>;
    insertFn(name: string, templateFn: () => Promise<JsReportTemplate>): Promise<void>;
    insert(template: JsReportTemplate): Promise<void>;
    upsert(template: JsReportTemplate): Promise<void>;
    remove(name: string): Promise<void>;
    find(name: string): Promise<JsReportTemplate>;
}

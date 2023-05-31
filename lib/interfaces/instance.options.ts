import type JsReport from 'jsreport-core';
export interface JsReportInstanceOptions {
  config?: JsReport.Configuration;
  recipes: Array<
    | 'html'
    | 'docx'
    | 'xlsx'
    | 'chrome-pdf'
    | 'html-to-xlsx'
    | 'pptx'
    | 'docxtemplater'
    | 'text'
  >;

  engines?: Array<'ejs' | 'handlebars' | 'jsrender' | 'pug'>;
  extensions?: Array<
    | 'aws-s3-storage'
    | 'azure-storage'
    | 'child-templates'
    | 'components'
    | 'fs-store-aws-s3-persistence'
    | 'fs-store-azure-storage-persistence'
    | 'fs-store'
    | 'import-export'
    | 'localization'
    | 'mongodb-store'
    | 'mssql-store'
    | 'office-password'
    | 'oracle-store'
    | 'pdf-utils'
    | 'postgres-store'
    | 'reports'
    | 'unoconv'
  >;
}

import { Reporter } from 'jsreport-core';

import { JsReportTemplate } from '../types';

export class TemplateHelper {
  private readonly jsReport: Reporter;

  constructor(jsReport: Reporter) {
    this.jsReport = jsReport;
  }

  async stored(name: string) {
    const result = await this.jsReport.documentStore
      .collection('templates')
      .find({ name });

    return result.length > 0;
  }

  async insertFn(name: string, templateFn: () => Promise<JsReportTemplate>) {
    const isStored = await this.stored(name);
    if (!isStored) {
      await this.insert(await templateFn());
    }
  }

  async insert(template: JsReportTemplate) {
    const isStored = await this.stored(template.name);
    if (!isStored) {
      await this.jsReport.documentStore
        .collection('templates')
        .insert(template);
    }
  }

  async upsert(template: JsReportTemplate) {
    const isStored = await this.stored(template.name);

    if (!isStored) {
      await this.insert(template);
    } else {
      await this.jsReport.documentStore
        .collection('templates')
        .update({ name: template.name }, { $set: template });
    }
  }

  async remove(name: string) {
    const isStored = await this.stored(name);

    if (isStored) {
      await this.jsReport.documentStore
        .collection('templates')
        .remove({ name });
    }
  }

  async find(name: string) {
    const isStored = await this.stored(name);

    if (isStored) {
      const found = await this.jsReport.documentStore
        .collection('templates')
        .find({ name });

      return found[found.length - 1] as JsReportTemplate;
    }
  }
}

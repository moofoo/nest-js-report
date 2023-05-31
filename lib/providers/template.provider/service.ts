import { AssetHelper } from '../../helpers/asset.helper';
import { TemplateHelper } from '../../helpers/template.helper';
import { JsReportResult } from '../../types';
import path from 'path';
import cloneDeep from 'lodash.clonedeep';
import fs from 'fs';
import type JsReport from 'jsreport-core';
import { StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { JsReportTemplateOptions } from '../../interfaces/template.options';
import { JsReportRenderOptions } from '../../types';

export class JsReportTemplateService {
  private assetsInitialized = false;
  private templateInitialized = false;

  constructor(
    private readonly options: JsReportTemplateOptions,
    readonly instance: JsReport.Reporter,
  ) {
    this.asset = new AssetHelper(instance);
    this.template = new TemplateHelper(instance);
    this.script = new AssetHelper(instance, 'scripts');

    if (options.initialize === true) {
      setTimeout(async () => {
        await this.initialize();
      });
    }
  }

  asset: AssetHelper;
  template: TemplateHelper;
  script: AssetHelper;

  get documentStore() {
    return this.instance.documentStore;
  }

  private async initAssets() {
    if (this.assetsInitialized) {
      return;
    }

    if (this.options.assets?.length > 0) {
      await this.asset.insertAll(
        this.options.assets.map((asset) => {
          if (asset.path.slice(0, 1) !== '/') {
            return {
              ...asset,
              path: path.join(this.options.folder, asset.path),
            };
          }
          return asset;
        }),
      );
    }

    if (this.options.scripts?.length > 0) {
      await this.script.insertAll(
        this.options.scripts.map((script) => {
          if (script.path.slice(0, 1) !== '/') {
            return {
              ...script,
              path: path.join(this.options.folder, script.path),
              encoding: 'utf-8',
            };
          }
          return script;
        }),
      );
    }

    this.assetsInitialized = true;
  }

  private async clearAssets() {
    if (this.options.assets?.length > 0) {
      for (const asset of this.options.assets) {
        await this.asset.remove(asset.name);
      }
    }

    if (this.options.scripts?.length > 0) {
      for (const script of this.options.scripts) {
        await this.script.remove(script.name);
      }
    }

    this.assetsInitialized = false;
  }

  private async initialize() {
    await this.initAssets();

    if (this.templateInitialized) {
      return;
    }

    const template = cloneDeep(this.options.template);

    if (!template.name) {
      template.name = this.options.name;
    }

    if (template.recipe === 'xlsx') {
      if (!template.content) {
        template.content = '{{{xlsxPrint}}}';
      }

      if (typeof (template as any).xlsx?.templateAsset?.content === 'string') {
        if (
          (template as any).xlsx?.templateAsset?.content?.slice(-5) === '.xlsx'
        ) {
          (template as any).xlsx.templateAsset.content = fs.readFileSync(
            path.join(
              this.options.folder,
              (template as any).xlsx.templateAsset.content,
            ),
            'base64',
          );
          (template as any).xlsx.templateAsset.encoding = 'base64';
        }
      }
    }

    if (template.recipe === 'docx') {
      template.content = '';
      if (typeof template.docx?.templateAsset?.content === 'string') {
        if (template.docx.templateAsset.content.slice(-5) === '.docx') {
          template.docx.templateAsset.content = fs.readFileSync(
            path.join(this.options.folder, template.docx.templateAsset.content),
            'base64',
          );

          template.docx.templateAsset.encoding = 'base64';
        }
      }
    }

    if (template.recipe === 'html-to-xlsx') {
      if (
        typeof (template as any).htmlToXlsx?.templateAssetShortid === 'string'
      ) {
        (template as any).htmlToXlsx.templateAssetShortid =
          await this.asset.shortId(
            (template as any).htmlToXlsx.templateAssetShortid,
          );
      }
    }

    if (
      ['chrome-pdf', 'html-to-xlsx'].includes(template.recipe) &&
      (template.content.slice(-5) === '.html' ||
        template.content.slice(-4) === '.htm')
    ) {
      template.content = fs.readFileSync(
        path.join(this.options.folder, template.content),
        'utf-8',
      );
    }

    if (!!template.helpers) {
      template.helpers = fs.readFileSync(
        path.join(this.options.folder, template.helpers as any),
        'utf-8',
      );
    }

    await this.template.insert(template);

    console.log(this.options.name, 'initialized');

    this.templateInitialized = true;
  }

  async render(data = {}, pdf = false) {
    await this.initialize();

    const renderOpts = {
      options: { reportName: this.options.name },
      template: {
        name: this.options.name,
        engine: this.options.template.engine,
        recipe: this.options.template.recipe,
        unoconv: undefined,
      },
      data,
    };

    if (pdf) {
      renderOpts.template.unoconv = {
        format: 'pdf',
        enabled: true,
      };
    }

    const result = await this.instance.render(renderOpts);

    setTimeout(async () => {
      await this.clearAssets();
    });

    return result as JsReportResult;
  }

  private getDefaultType() {
    const { recipe } = this.options.template;
    if (recipe.includes('pdf')) {
      return 'pdf';
    }

    if (recipe.includes('xlsx')) {
      return 'xlsx';
    }

    if (recipe.includes('docx')) {
      return 'docx';
    }

    if (recipe.includes('pptx')) {
      return 'pptx';
    }
  }

  getContentHeaders(result: JsReportResult, pdf = false, fileName?: string) {
    return {
      'Content-Type': pdf
        ? 'application/pdf'
        : `${result.meta.contentType}; charset=utf-8`,
      'Content-Disposition': `attachment; filename="${
        fileName || result.meta.reportName
      }.${pdf ? 'pdf' : this.getDefaultType()}"`,
      'Content-Length': result.content.byteLength,
    };
  }

  async streamFile(
    res: Response,
    data = {},
    options: JsReportRenderOptions = { pdf: false },
  ) {
    const { pdf, fileName } = options;
    const result = await this.render(data, pdf);
    res.set(this.getContentHeaders(result, pdf, fileName));
    return new StreamableFile(result.stream as any);
  }
}

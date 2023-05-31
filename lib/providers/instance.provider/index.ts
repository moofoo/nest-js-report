import type JsReport from 'jsreport-core';
import JsReportCore from '@jsreport/jsreport-core';
import { JsReportInstanceOptions } from '../../interfaces/instance.options';
import { Provider } from '@nestjs/common';
import {
  JSREPORT_INSTANCE_TOKEN,
  JSREPORT_ROOT_OPTIONS_TOKEN,
} from '../../constants';

type Reporter = JsReport.Reporter & { rootOptions?: JsReportInstanceOptions };

const useFactory = async (options: JsReportInstanceOptions) => {
  const { extensions: extensionOpts = {}, ...rest } = options.config || {};

  console.log('js report instance factory');

  const jsReport = JsReportCore({
    loadConfig: false,
    allowLocalFilesAccess: true,
    autoTempCleanup: true,
    discover: false,
    ...rest,
    trustUserCode: true,
    templatingEngines: { allowedModules: '*', strategy: 'in-process' },
    extensions: {
      'html-to-xlsx': {
        launchOptions: {
          headless: 'new',
        },
      },
      'chrome-pdf': {
        timeout: 30000,
        launchOptions: {
          headless: 'new',
        },
      },
      ...extensionOpts,
      express: {
        enabled: false,
      },
      studio: {
        enabled: false,
      },
      assets: {
        allowedFiles: '**/*.*',
      },
    },
  } as JsReport.Configuration) as Reporter;

  jsReport.use(require('@jsreport/jsreport-assets')());
  jsReport.use(require('@jsreport/jsreport-scripts')());

  jsReport.rootOptions = options;

  let engines = options.engines;

  if (!engines) {
    engines = ['handlebars'];
  }

  const extensions = (options.extensions || []).filter((extension) => {
    if (['assets', 'scripts', 'components'].includes(extension)) {
      return false;
    }

    return true;
  });

  const recipes = options.recipes || [];

  for (const extension of extensions) {
    jsReport.use(require(`@jsreport/jsreport-${extension}`)());
  }

  for (const engine of engines) {
    jsReport.use(require(`@jsreport/jsreport-${engine}`)());
  }

  for (const recipe of recipes) {
    jsReport.use(require(`@jsreport/jsreport-${recipe}`)());
  }

  await jsReport.init();

  return jsReport;
};

export const getJsReportInstanceProvider = (
  options: JsReportInstanceOptions,
): Provider => {
  return {
    provide: JSREPORT_INSTANCE_TOKEN,
    useFactory: async () => useFactory(options),
    inject: [JSREPORT_ROOT_OPTIONS_TOKEN],
  };
};

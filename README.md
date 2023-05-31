# nest-js-report

[NestJS](https://nestjs.com/) + [JsReport](https://jsreport.net/)

```console
yarn add https://github.com/moofoo/nest-js-report
```

## Example Code

### src/app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JsReportModule } from 'nest-js-report';

@Module({
  imports: [
    JsReportModule.forRoot({
      engines: ['handlebars'],
      recipes: ['docx'],
      extensions: ['unoconv'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### src/reports/reports.module.ts

```typescript
import { Module } from '@nestjs/common';
import { JsReportModule } from 'nest-js-report';
import { ReportsController } from './reports.controller';

@Module({
  imports: [
    JsReportModule.registerTemplate({
      folder: __dirname,
      name: 'invoice',
      template: {
        engine: 'handlebars',
        recipe: 'docx',
        docx: { templateAsset: { content: 'invoice/template.docx' } },
      },
    }),
  ],
  controllers: [ReportsController],
})
export class ReportsModule {}
```

### src/reports/reports.controller.ts

```typescript
import { Controller, Get, Res } from '@nestjs/common';
import { InjectJsrTemplate, JsReportTemplateService } from 'nest-js-report';
import { Response } from 'express';
import invoiceData from './invoice/data.json';

@Controller()
export class ReportsController {
      constructor(
            @InjectJsrTemplate('invoice') readonly invoice:JsReportTemplateService
      )

      @Get('/invoice')
      async getInvoice(@Res({ passthrough: true }) res: Response) {
            return this.invoice.streamFile(res, invoiceData)
      }
}
```

### For implementation examples, see [nestjs-jsreport-examples](https://github.com/moofoo/nestjs-jsreport-examples)

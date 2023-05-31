"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JsReportModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsReportModule = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const token_helper_1 = require("./helpers/token.helper");
const instance_provider_1 = require("./providers/instance.provider");
const template_provider_1 = require("./providers/template.provider");
const constants_2 = require("./constants");
let JsReportModule = JsReportModule_1 = class JsReportModule {
    static forRoot(options) {
        return {
            global: true,
            module: JsReportModule_1,
            providers: [
                {
                    provide: constants_1.JSREPORT_ROOT_OPTIONS_TOKEN,
                    useValue: options,
                },
                (0, instance_provider_1.getJsReportInstanceProvider)(options),
            ],
            exports: [constants_2.JSREPORT_INSTANCE_TOKEN],
        };
    }
    static registerTemplate(options) {
        return {
            module: JsReportModule_1,
            providers: [
                {
                    provide: (0, token_helper_1.getTemplateOptionsToken)(options.name),
                    useValue: options,
                },
                (0, template_provider_1.getTemplateProvider)(options),
            ],
            exports: [(0, token_helper_1.getTemplateToken)(options.name)],
        };
    }
};
JsReportModule = JsReportModule_1 = __decorate([
    (0, common_1.Module)({})
], JsReportModule);
exports.JsReportModule = JsReportModule;
//# sourceMappingURL=jsreport.module.js.map
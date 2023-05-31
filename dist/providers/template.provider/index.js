"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateProvider = void 0;
const constants_1 = require("../../constants");
const token_helper_1 = require("../../helpers/token.helper");
const service_1 = require("./service");
const useFactory = async (options, instance) => {
    return new service_1.JsReportTemplateService(options, instance);
};
const getTemplateProvider = (options) => {
    return {
        provide: (0, token_helper_1.getTemplateToken)(options.name),
        useFactory,
        inject: [(0, token_helper_1.getTemplateOptionsToken)(options.name), constants_1.JSREPORT_INSTANCE_TOKEN],
    };
};
exports.getTemplateProvider = getTemplateProvider;
//# sourceMappingURL=index.js.map
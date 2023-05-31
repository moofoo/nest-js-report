"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateToken = exports.getInstanceToken = exports.getTemplateOptionsToken = exports.getRootOptionsToken = void 0;
function getRootOptionsToken(name) {
    return name ? `JsReportOptions_${name}` : 'JsReportOptions_default';
}
exports.getRootOptionsToken = getRootOptionsToken;
function getTemplateOptionsToken(name) {
    return name ? `JsReportOptions_${name}` : 'JsReportOptions_default';
}
exports.getTemplateOptionsToken = getTemplateOptionsToken;
function getInstanceToken(name) {
    return name ? `JsReportInstance_${name}` : 'JsReportInstance_default';
}
exports.getInstanceToken = getInstanceToken;
function getTemplateToken(name) {
    return name ? `JsReportTemplate_${name}` : 'JsReportTemplate_default';
}
exports.getTemplateToken = getTemplateToken;
//# sourceMappingURL=token.helper.js.map
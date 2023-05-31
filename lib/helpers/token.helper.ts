export function getRootOptionsToken(name?: string): string {
  return name ? `JsReportOptions_${name}` : 'JsReportOptions_default';
}

export function getTemplateOptionsToken(name?: string): string {
  return name ? `JsReportOptions_${name}` : 'JsReportOptions_default';
}

export function getInstanceToken(name?: string): string {
  return name ? `JsReportInstance_${name}` : 'JsReportInstance_default';
}

export function getTemplateToken(name?: string): string {
  return name ? `JsReportTemplate_${name}` : 'JsReportTemplate_default';
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectJsrTemplate = void 0;
const token_helper_1 = require("../helpers/token.helper");
const common_1 = require("@nestjs/common");
const InjectJsrTemplate = (name) => (0, common_1.Inject)((0, token_helper_1.getTemplateToken)(name));
exports.InjectJsrTemplate = InjectJsrTemplate;
//# sourceMappingURL=inject-template.decorator.js.map
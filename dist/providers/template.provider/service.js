"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsReportTemplateService = void 0;
const asset_helper_1 = require("../../helpers/asset.helper");
const template_helper_1 = require("../../helpers/template.helper");
const path_1 = __importDefault(require("path"));
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const fs_1 = __importDefault(require("fs"));
const common_1 = require("@nestjs/common");
class JsReportTemplateService {
    constructor(options, instance) {
        this.options = options;
        this.instance = instance;
        this.assetsInitialized = false;
        this.templateInitialized = false;
        this.asset = new asset_helper_1.AssetHelper(instance);
        this.template = new template_helper_1.TemplateHelper(instance);
        this.script = new asset_helper_1.AssetHelper(instance, 'scripts');
        if (options.initialize === true) {
            setTimeout(async () => {
                await this.initialize();
            });
        }
    }
    get documentStore() {
        return this.instance.documentStore;
    }
    async initAssets() {
        var _a, _b;
        if (this.assetsInitialized) {
            return;
        }
        if (((_a = this.options.assets) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            await this.asset.insertAll(this.options.assets.map((asset) => {
                if (asset.path.slice(0, 1) !== '/') {
                    return Object.assign(Object.assign({}, asset), { path: path_1.default.join(this.options.folder, asset.path) });
                }
                return asset;
            }));
        }
        if (((_b = this.options.scripts) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            await this.script.insertAll(this.options.scripts.map((script) => {
                if (script.path.slice(0, 1) !== '/') {
                    return Object.assign(Object.assign({}, script), { path: path_1.default.join(this.options.folder, script.path), encoding: 'utf-8' });
                }
                return script;
            }));
        }
        this.assetsInitialized = true;
    }
    async clearAssets() {
        var _a, _b;
        if (((_a = this.options.assets) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            for (const asset of this.options.assets) {
                await this.asset.remove(asset.name);
            }
        }
        if (((_b = this.options.scripts) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            for (const script of this.options.scripts) {
                await this.script.remove(script.name);
            }
        }
        this.assetsInitialized = false;
    }
    async initialize() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        await this.initAssets();
        if (this.templateInitialized) {
            return;
        }
        const template = (0, lodash_clonedeep_1.default)(this.options.template);
        if (!template.name) {
            template.name = this.options.name;
        }
        if (template.recipe === 'xlsx') {
            if (!template.content) {
                template.content = '{{{xlsxPrint}}}';
            }
            if (typeof ((_b = (_a = template.xlsx) === null || _a === void 0 ? void 0 : _a.templateAsset) === null || _b === void 0 ? void 0 : _b.content) === 'string') {
                if (((_e = (_d = (_c = template.xlsx) === null || _c === void 0 ? void 0 : _c.templateAsset) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.slice(-5)) === '.xlsx') {
                    template.xlsx.templateAsset.content = fs_1.default.readFileSync(path_1.default.join(this.options.folder, template.xlsx.templateAsset.content), 'base64');
                    template.xlsx.templateAsset.encoding = 'base64';
                }
            }
        }
        if (template.recipe === 'docx') {
            template.content = '';
            if (typeof ((_g = (_f = template.docx) === null || _f === void 0 ? void 0 : _f.templateAsset) === null || _g === void 0 ? void 0 : _g.content) === 'string') {
                if (template.docx.templateAsset.content.slice(-5) === '.docx') {
                    template.docx.templateAsset.content = fs_1.default.readFileSync(path_1.default.join(this.options.folder, template.docx.templateAsset.content), 'base64');
                    template.docx.templateAsset.encoding = 'base64';
                }
            }
        }
        if (template.recipe === 'html-to-xlsx') {
            if (typeof ((_h = template.htmlToXlsx) === null || _h === void 0 ? void 0 : _h.templateAssetShortid) === 'string') {
                template.htmlToXlsx.templateAssetShortid =
                    await this.asset.shortId(template.htmlToXlsx.templateAssetShortid);
            }
        }
        if (['chrome-pdf', 'html-to-xlsx'].includes(template.recipe) &&
            (template.content.slice(-5) === '.html' ||
                template.content.slice(-4) === '.htm')) {
            template.content = fs_1.default.readFileSync(path_1.default.join(this.options.folder, template.content), 'utf-8');
        }
        if (!!template.helpers) {
            template.helpers = fs_1.default.readFileSync(path_1.default.join(this.options.folder, template.helpers), 'utf-8');
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
        return result;
    }
    getDefaultType() {
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
    getContentHeaders(result, pdf = false, fileName) {
        return {
            'Content-Type': pdf
                ? 'application/pdf'
                : `${result.meta.contentType}; charset=utf-8`,
            'Content-Disposition': `attachment; filename="${fileName || result.meta.reportName}.${pdf ? 'pdf' : this.getDefaultType()}"`,
            'Content-Length': result.content.byteLength,
        };
    }
    async streamFile(res, data = {}, options = { pdf: false }) {
        const { pdf, fileName } = options;
        const result = await this.render(data, pdf);
        res.set(this.getContentHeaders(result, pdf, fileName));
        return new common_1.StreamableFile(result.stream);
    }
}
exports.JsReportTemplateService = JsReportTemplateService;
//# sourceMappingURL=service.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetHelper = void 0;
const fs_1 = __importDefault(require("fs"));
class AssetHelper {
    constructor(jsReport, collectionName = 'assets') {
        this.collectionName = 'assets';
        this.collectionName = collectionName;
        this.jsReport = jsReport;
    }
    async stored(name) {
        const result = await this.jsReport.documentStore
            .collection(this.collectionName)
            .find({ name });
        return result.length > 0;
    }
    async shortId(name) {
        var _a;
        const isStored = await this.stored(name);
        if (!isStored) {
            return 'shortId';
        }
        return (_a = ((await this.find(name)))) === null || _a === void 0 ? void 0 : _a.shortid;
    }
    async insert(asset) {
        const isStored = await this.stored(asset.name);
        if (!isStored) {
            if (asset.path && !asset.content) {
                asset.content = fs_1.default.readFileSync(asset.path, asset.encoding);
            }
        }
        await this.jsReport.documentStore
            .collection(this.collectionName)
            .insert(asset);
    }
    async insertAll(assets) {
        for (const asset of assets) {
            await this.insert(asset);
        }
    }
    async upsert(asset) {
        const isStored = await this.stored(asset.name);
        if (!isStored) {
            await this.insert(asset);
        }
        else {
            if (asset.path && !asset.content) {
                asset.content = fs_1.default.readFileSync(asset.path, asset.encoding);
            }
            await this.jsReport.documentStore.collection(this.collectionName).update({ name: asset.name }, {
                $set: {
                    content: asset.content,
                    encoding: asset.encoding,
                    scope: asset.scope,
                },
            });
        }
    }
    async remove(name) {
        const isStored = await this.stored(name);
        if (isStored) {
            await this.jsReport.documentStore
                .collection(this.collectionName)
                .remove({ name });
        }
    }
    async find(name) {
        const isStored = await this.stored(name);
        if (isStored) {
            const found = await this.jsReport.documentStore
                .collection(this.collectionName)
                .find({ name });
            return found[found.length - 1];
        }
    }
}
exports.AssetHelper = AssetHelper;
//# sourceMappingURL=asset.helper.js.map
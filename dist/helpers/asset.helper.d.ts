import Jsreport from 'jsreport-core';
type Asset = {
    name: string;
    path?: string;
    content?: any;
    encoding?: string;
    scope?: 'global' | 'template';
};
export declare class AssetHelper {
    private readonly jsReport;
    collectionName: string;
    constructor(jsReport: Jsreport.Reporter, collectionName?: string);
    stored(name: string): Promise<boolean>;
    shortId(name: any): Promise<any>;
    insert(asset: Asset): Promise<void>;
    insertAll(assets: Array<Asset>): Promise<void>;
    upsert(asset: Asset): Promise<void>;
    remove(name: string): Promise<void>;
    find(name: string): Promise<Asset>;
}
export {};

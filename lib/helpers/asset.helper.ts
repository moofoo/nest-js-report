import Jsreport from 'jsreport-core';
import fs from 'fs';

type Asset = {
  name: string;
  path?: string;
  content?: any;
  encoding?: string;
  scope?: 'global' | 'template';
};

export class AssetHelper {
  private readonly jsReport: Jsreport.Reporter;
  collectionName = 'assets';

  constructor(jsReport: Jsreport.Reporter, collectionName = 'assets') {
    this.collectionName = collectionName;
    this.jsReport = jsReport;
  }

  async stored(name: string) {
    const result = await this.jsReport.documentStore
      .collection(this.collectionName)
      .find({ name });

    return result.length > 0;
  }

  async shortId(name) {
    const isStored = await this.stored(name);

    if (!isStored) {
      return 'shortId';
    }

    return ((await this.find(name)) as any)?.shortid;
  }

  async insert(asset: Asset) {
    const isStored = await this.stored(asset.name);

    if (!isStored) {
      if (asset.path && !asset.content) {
        asset.content = fs.readFileSync(asset.path, asset.encoding as any);
      }
    }

    await this.jsReport.documentStore
      .collection(this.collectionName)
      .insert(asset);
  }

  async insertAll(assets: Array<Asset>) {
    for (const asset of assets) {
      await this.insert(asset);
    }
  }

  async upsert(asset: Asset) {
    const isStored = await this.stored(asset.name);

    if (!isStored) {
      await this.insert(asset);
    } else {
      if (asset.path && !asset.content) {
        asset.content = fs.readFileSync(asset.path, asset.encoding as any);
      }

      await this.jsReport.documentStore.collection(this.collectionName).update(
        { name: asset.name },
        {
          $set: {
            content: asset.content,
            encoding: asset.encoding,
            scope: asset.scope,
          },
        },
      );
    }
  }

  async remove(name: string) {
    const isStored = await this.stored(name);

    if (isStored) {
      await this.jsReport.documentStore
        .collection(this.collectionName)
        .remove({ name });
    }
  }

  async find(name: string) {
    const isStored = await this.stored(name);

    if (isStored) {
      const found = await this.jsReport.documentStore
        .collection(this.collectionName)
        .find({ name });

      return found[found.length - 1] as Asset;
    }
  }
}

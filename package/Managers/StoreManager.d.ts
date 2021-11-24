import { PluginStoreImportsObject } from "./PluginManager";
export declare type StoreModule = {
    fileName: string | undefined;
    name: string | undefined;
    camelName: string | undefined;
    globalName?: string | undefined;
    absolutePath: string;
    relativePath: string;
    shortName: string;
    shortCamelName: string;
    isInSubDir: boolean;
};
export declare type StoreExportsObject = {
    exportConstName: string;
    constructorName: string;
};
export declare type StoreExportsImportsObject = {
    imports: PluginStoreImportsObject[];
    exports: StoreExportsObject[];
};
export declare class StoreManager {
    static stores: StoreModule[];
    static storeExports: string;
    static loadStores(): void;
    static storeExportsObject(): StoreExportsImportsObject;
    static isStoreFile(file: string): boolean;
    static generateStoreExportsFile(): void;
    static generateTypeDefs(): void;
}

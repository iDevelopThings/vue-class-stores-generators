export declare type PluginStoreImportsObject = {
    moduleName: string;
    importPath: string;
};
export declare class PluginManager {
    static pluginStoreImports: string;
    static vuePluginStoreImports: string;
    static pluginStoreImportsObject(): PluginStoreImportsObject[];
    static generatePluginStoreImports(): void;
    static generatePlugin(): void;
    static generateStoreMetaFile(): void;
    static generateStoreClass(): void;
    static generateVueCompositionApiExportsFile(): void;
    static clearFiles(): void;
}

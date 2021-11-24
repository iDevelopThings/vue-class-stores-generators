import { VueVersionManager } from "./Managers/VueVersionManager";
export declare type FileNames = {
    stores: string;
    definitions: string;
    plugin: string;
    storeClass: string;
    vueCompApi: string;
    vueCompApiExports: string;
};
export declare type PluginConfiguration = {
    usingTypescript?: boolean;
    pluginDirectory?: string;
    storesDirectory?: string;
    shortVueDeclaration?: boolean;
};
export declare type ConfigurationManagerConfiguration = {
    usingTypescript: boolean;
    pluginDirectory: string;
    storesDirectory: string;
    storesPath?: string;
    pluginPath?: string;
    shortVueDeclaration: boolean;
    versionManager: VueVersionManager;
    vueVersion: 2 | 3;
    fileExtension: string;
    storesFilePath?: string;
    definitionsFilePath?: string;
    vueStorePluginFilePath?: string;
    storeClassFilePath?: string;
};
export declare class Configuration {
    static usingTypescript: boolean;
    static pluginDirectory: string;
    static storesDirectory: string;
    static storesPath?: string;
    static pluginPath?: string;
    static shortVueDeclaration: boolean;
    static versionManager: VueVersionManager;
    static vueVersion: 2 | 3;
    static fileExtension: string;
    static storesFilePath?: string;
    static definitionsFilePath?: string;
    static vueStorePluginFilePath?: string;
    static vueCompositionInstallScriptFilePath?: string;
    static vueCompositionExportsFilePath?: string;
    static storeClassFilePath?: string;
    static setConfiguration(configuration?: PluginConfiguration): void;
    static getPackageJsonConfig(): any;
    static hasPackageJsonConfig(): boolean;
    static set(key: keyof ConfigurationManagerConfiguration, value: any): void;
    private static setupConfiguration;
    static fileNames(withExtensions?: boolean, absolutePath?: boolean): FileNames;
}

export declare class VueVersionManager {
    private version;
    constructor();
    static get(): VueVersionManager;
    getVersion(): 2 | 3;
    isVue3(): boolean;
    isVue2(): boolean;
    isInvalidVersion(): boolean;
}

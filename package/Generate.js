"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = exports.generate = void 0;
var Configuration_1 = require("./Configuration");
var PluginManager_1 = require("./Managers/PluginManager");
var StoreManager_1 = require("./Managers/StoreManager");
var chokidar_1 = __importDefault(require("chokidar"));
var Utilities_1 = require("./Utilities");
function generate(compilation, configuration) {
    if (!Configuration_1.Configuration.hasPackageJsonConfig()) {
        console.warn('You do not have config set in package.json file. Please add the config values there also, read the docs for more info.');
        return;
    }
    Configuration_1.Configuration.setConfiguration(configuration);
    StoreManager_1.StoreManager.loadStores();
    if (Configuration_1.Configuration.versionManager.isInvalidVersion()) {
        var ERROR = 'VUE VERSION IS NOT 2 OR 3. CANNOT USE VUE CLASS STORE PLUGIN.';
        if (compilation) {
            compilation.errors.push(new Error(ERROR));
            return;
        }
        throw new Error(ERROR);
    }
    //		PluginManager.clearFiles();
    PluginManager_1.PluginManager.generateVueCompositionApiExportsFile();
    PluginManager_1.PluginManager.generateStoreMetaFile();
    PluginManager_1.PluginManager.generateStoreClass();
    PluginManager_1.PluginManager.generatePluginStoreImports();
    StoreManager_1.StoreManager.generateStoreExportsFile();
    StoreManager_1.StoreManager.generateTypeDefs();
    PluginManager_1.PluginManager.generatePlugin();
}
exports.generate = generate;
function watch(configuration) {
    var _this = this;
    if (!Configuration_1.Configuration.hasPackageJsonConfig()) {
        console.warn('You do not have config set in package.json file. Please add the config values there also, read the docs for more info.');
        return;
    }
    Configuration_1.Configuration.setConfiguration(configuration);
    StoreManager_1.StoreManager.loadStores();
    var watcher = chokidar_1.default.watch(Configuration_1.Configuration.storesPath, {
        ignoreInitial: true,
        ignored: Object.values(Configuration_1.Configuration.fileNames(true, true))
    });
    watcher.on('all', function (event, filename) {
        if (event !== 'add' && event !== 'unlink' && event !== 'change') {
            return;
        }
        if (Utilities_1.isInternallyGeneratedFile(filename)) {
            return;
        }
        generate(undefined, _this.configuration);
        console.log('Re-generated vue-class-store files.');
    });
}
exports.watch = watch;
//# sourceMappingURL=Generate.js.map
"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = void 0;
var path_1 = __importDefault(require("path"));
var VueVersionManager_1 = require("./Managers/VueVersionManager");
var packageJson = require(path_1.default.resolve(process.cwd(), 'package.json'));
var Configuration = /** @class */ (function () {
    function Configuration() {
    }
    Configuration.setConfiguration = function (configuration) {
        this.usingTypescript = false;
        this.pluginDirectory = path_1.default.join('src', 'Stores', 'Plugin');
        this.storesDirectory = path_1.default.join('src', 'Stores');
        this.shortVueDeclaration = false;
        this.versionManager = new VueVersionManager_1.VueVersionManager();
        this.vueVersion = VueVersionManager_1.VueVersionManager.get().getVersion();
        this.fileExtension = '.js';
        if (configuration === undefined) {
            if (this.hasPackageJsonConfig()) {
                configuration = this.getPackageJsonConfig();
            }
        }
        this.setupConfiguration(configuration);
    };
    Configuration.getPackageJsonConfig = function () {
        return packageJson["vue-class-stores"] || {};
    };
    Configuration.hasPackageJsonConfig = function () {
        var packageJsonConfig = packageJson["vue-class-stores"];
        return packageJsonConfig !== undefined;
    };
    Configuration.set = function (key, value) {
        //@ts-ignore
        this[key] = value;
    };
    Configuration.setupConfiguration = function (configuration) {
        var e_1, _a;
        try {
            // Set the main configurations that were passed to the plugin
            for (var _b = __values(Object.keys(configuration)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                if (configuration[key] === undefined) {
                    continue;
                }
                this.set(key, configuration[key]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Lets now configure any additional configs
        this.fileExtension = configuration.usingTypescript ? '.ts' : '.js';
        this.storesPath = path_1.default.resolve.apply(path_1.default, __spreadArray([], __read(this.storesDirectory.split(path_1.default.sep))));
        this.pluginPath = path_1.default.resolve.apply(path_1.default, __spreadArray([], __read(this.pluginDirectory.split(path_1.default.sep))));
        this.storesFilePath = path_1.default.resolve.apply(path_1.default, __spreadArray(__spreadArray([], __read(this.pluginDirectory.split(path_1.default.sep))), [this.fileNames(true).stores]));
        this.definitionsFilePath = path_1.default.resolve.apply(path_1.default, __spreadArray(__spreadArray([], __read(this.pluginDirectory.split(path_1.default.sep))), [this.fileNames(true).definitions]));
        this.vueStorePluginFilePath = path_1.default.resolve.apply(path_1.default, __spreadArray(__spreadArray([], __read(this.pluginDirectory.split(path_1.default.sep))), [this.fileNames(true).plugin]));
        this.vueCompositionExportsFilePath = path_1.default.resolve.apply(path_1.default, __spreadArray(__spreadArray([], __read(this.pluginDirectory.split(path_1.default.sep))), [this.fileNames(true).vueCompApiExports]));
        this.vueCompositionInstallScriptFilePath = path_1.default.resolve.apply(path_1.default, __spreadArray(__spreadArray([], __read(this.pluginDirectory.split(path_1.default.sep))), [this.fileNames(true).vueCompApi]));
        this.storeClassFilePath = path_1.default.resolve.apply(path_1.default, __spreadArray(__spreadArray([], __read(this.pluginDirectory.split(path_1.default.sep))), [this.fileNames(true).storeClass]));
    };
    Configuration.fileNames = function (withExtensions, absolutePath) {
        if (withExtensions === void 0) { withExtensions = false; }
        if (absolutePath === void 0) { absolutePath = false; }
        var fileNames = {
            stores: 'VueStores',
            definitions: 'VueClassStoresPluginTypes.d.ts',
            plugin: 'VueClassStoresPlugin',
            storeClass: 'Store',
            vueCompApi: 'InstallVueCompositionApi',
            vueCompApiExports: 'VueCompositionApiExports',
        };
        if (absolutePath) {
            fileNames.storeClass = path_1.default.join(this.pluginDirectory, fileNames.storeClass);
            fileNames.stores = path_1.default.join(this.pluginDirectory, fileNames.stores);
            fileNames.definitions = path_1.default.join(this.pluginDirectory, fileNames.definitions);
            fileNames.plugin = path_1.default.join(this.pluginDirectory, fileNames.plugin);
            fileNames.vueCompApi = path_1.default.join(this.pluginDirectory, fileNames.vueCompApi);
            fileNames.vueCompApiExports = path_1.default.join(this.pluginDirectory, fileNames.vueCompApiExports);
        }
        if (withExtensions) {
            fileNames.storeClass += this.fileExtension;
            fileNames.stores += this.fileExtension;
            fileNames.plugin += this.fileExtension;
            fileNames.vueCompApi += this.fileExtension;
            fileNames.vueCompApiExports += this.fileExtension;
        }
        return fileNames;
    };
    return Configuration;
}());
exports.Configuration = Configuration;
//# sourceMappingURL=Configuration.js.map
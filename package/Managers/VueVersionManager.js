"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueVersionManager = void 0;
var path_1 = __importDefault(require("path"));
var semver = require('semver');
var packageJson = require(path_1.default.resolve(process.cwd(), 'package.json'));
var instance = null;
var VueVersionManager = /** @class */ (function () {
    function VueVersionManager() {
        var _a;
        this.version = null;
        var deps = __assign(__assign({}, packageJson.dependencies), packageJson.devDependencies);
        if (!(deps === null || deps === void 0 ? void 0 : deps.vue)) {
            console.error('Vuejs is not found in package.json.\nPlease run:\nnpm install vue@next - for vue 3\nnpm install vue - for vue 2');
            return;
        }
        var version = semver.coerce(deps.vue);
        if (version.major !== 2 && version.major !== 3) {
            return;
        }
        this.version = (_a = version === null || version === void 0 ? void 0 : version.major) !== null && _a !== void 0 ? _a : null;
        instance = this;
    }
    VueVersionManager.get = function () {
        return instance;
    };
    VueVersionManager.prototype.getVersion = function () {
        return this.version;
    };
    VueVersionManager.prototype.isVue3 = function () {
        return this.getVersion() === 3;
    };
    VueVersionManager.prototype.isVue2 = function () {
        return this.getVersion() === 2;
    };
    VueVersionManager.prototype.isInvalidVersion = function () {
        return this.getVersion() === null;
    };
    return VueVersionManager;
}());
exports.VueVersionManager = VueVersionManager;
//# sourceMappingURL=VueVersionManager.js.map
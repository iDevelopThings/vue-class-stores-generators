"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInternallyGeneratedFile = exports.getTemplate = exports.correctPackageImportName = exports.camelize = exports.ensureDirectoryExists = exports.writeFile = exports.walkDirectory = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var Configuration_1 = require("./Configuration");
/**
 * @param {string} directory
 * @param {boolean} isSubDir
 */
var walkDirectory = function (directory, isSubDir) {
    if (isSubDir === void 0) { isSubDir = false; }
    var files = [];
    fs_1.default.readdirSync(directory).forEach(function (name) {
        var filePath = path_1.default.join(directory, name);
        var stat = fs_1.default.statSync(filePath);
        if (stat.isFile()) {
            if (!(/Store\.(ts|js)$/.test(name))) {
                return;
            }
            files.push({ filePath: filePath, stat: stat, isSubDir: isSubDir });
        }
        else if (stat.isDirectory()) {
            files.push.apply(files, __spreadArray([], __read(exports.walkDirectory(filePath, true))));
        }
    });
    return files;
};
exports.walkDirectory = walkDirectory;
var writeFile = function (path, content) {
    exports.ensureDirectoryExists(path);
    fs_1.default.writeFileSync(path, content);
};
exports.writeFile = writeFile;
/**
 * Ensure that all of our directories exist...
 * if they don't, we'll create them
 *
 * @param {string} pathToPrepare
 */
var ensureDirectoryExists = function (pathToPrepare) {
    var e_1, _a;
    var pathParts = pathToPrepare.split(path_1.default.sep);
    var pathBuilt = pathParts[0];
    try {
        for (var pathParts_1 = __values(pathParts), pathParts_1_1 = pathParts_1.next(); !pathParts_1_1.done; pathParts_1_1 = pathParts_1.next()) {
            var pathPart = pathParts_1_1.value;
            if (pathBuilt.includes(pathPart)) {
                continue;
            }
            if (pathPart.endsWith(Configuration_1.Configuration.fileExtension)) {
                continue;
            }
            if (pathPart.endsWith('.json')) {
                continue;
            }
            var pathCheck = path_1.default.join(pathBuilt, pathPart);
            if (!pathCheck.endsWith(path_1.default.sep)) {
                pathCheck += path_1.default.sep;
            }
            if (!pathCheck.startsWith(path_1.default.sep)) {
                pathCheck = path_1.default.sep + pathCheck;
            }
            pathCheck = path_1.default.resolve(pathCheck);
            if (!fs_1.default.existsSync(pathCheck)) {
                fs_1.default.mkdirSync(pathCheck);
            }
            pathBuilt = path_1.default.join(pathBuilt, pathPart);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (pathParts_1_1 && !pathParts_1_1.done && (_a = pathParts_1.return)) _a.call(pathParts_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
};
exports.ensureDirectoryExists = ensureDirectoryExists;
var camelize = function (str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
};
exports.camelize = camelize;
var correctPackageImportName = function (importString) {
    var importStringResponse = importString;
    //Hacky fix to properly reference the packages directory
    if (!process.cwd().includes('/Packages/VueClassStore')) {
        importStringResponse = 'vue-class-stores-generators';
    }
    if (importStringResponse.endsWith('vite-apptest') || importStringResponse.endsWith('apptest')) {
        importStringResponse = importStringResponse.replace('/vite-apptest', '');
        importStringResponse = importStringResponse.replace('/apptest', '');
    }
    return importStringResponse;
};
exports.correctPackageImportName = correctPackageImportName;
var getTemplate = function (name, vueVersion) {
    var rootPackageDir = process.cwd();
    //Hacky fix to properly reference the packages directory
    if (!rootPackageDir.includes('/Packages/VueClassStore')) {
        rootPackageDir = path_1.default.join(process.cwd(), 'node_modules', 'vue-class-stores-generators');
    }
    if (rootPackageDir.endsWith('vite-apptest') || rootPackageDir.endsWith('apptest')) {
        rootPackageDir = rootPackageDir.replace('/vite-apptest', '');
        rootPackageDir = rootPackageDir.replace('/apptest', '');
    }
    return fs_1.default.readFileSync(path_1.default.resolve(rootPackageDir, 'template', "vue" + vueVersion, name + ".template.txt"), { encoding: 'utf-8' });
};
exports.getTemplate = getTemplate;
var isInternallyGeneratedFile = function (file) {
    var e_2, _a;
    var files = Object.values(Configuration_1.Configuration.fileNames(true, true));
    if (file.includes('stores.meta.json')) {
        return true;
    }
    try {
        for (var files_1 = __values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
            var internalFile = files_1_1.value;
            if (file.includes(path_1.default.resolve(internalFile)) || file.includes(internalFile)) {
                return true;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return false;
};
exports.isInternallyGeneratedFile = isInternallyGeneratedFile;
//# sourceMappingURL=Utilities.js.map
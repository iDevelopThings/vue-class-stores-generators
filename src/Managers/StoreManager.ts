import * as path from "path";
import {Configuration} from "../Configuration";
import {PluginManager, PluginStoreImportsObject} from "./PluginManager";
import {camelize, ensureDirectoryExists, getTemplate, walkDirectory, writeFile} from "../Utilities";

export type StoreModule = {
	fileName: string | undefined,
	name: string | undefined,
	camelName: string | undefined,
	globalName?: string | undefined,
	absolutePath: string,
	relativePath: string,
	shortName: string,
	shortCamelName: string,
	isInSubDir: boolean
}

export type StoreExportsObject = {
	exportConstName: string;
	constructorName: string;
}

export type StoreExportsImportsObject = {
	imports: PluginStoreImportsObject[],
	exports: StoreExportsObject[],
}

export class StoreManager {
	public static stores: StoreModule[] = [];
	public static storeExports: string  = null;

	public static loadStores() {
		ensureDirectoryExists(Configuration.storesPath);
		ensureDirectoryExists(Configuration.pluginPath);

		this.stores = [];

		const files = walkDirectory(Configuration.storesPath);

		for (let {filePath, isSubDir} of files) {

			if (filePath.includes(Configuration.fileNames(true, true).storeClass)) {
				continue;
			}

			const fileName       = filePath.split(path.sep).pop();
			const name           = fileName.split('.').shift();
			const shortName      = fileName.split('.').shift().replace('Store', '');
			const camelName      = camelize(name);
			const shortCamelName = camelize(name).replace('Store', '');

			this.stores.push({
				fileName,
				name,
				camelName,
				absolutePath : filePath,
				relativePath : filePath.replace(Configuration.storesPath + path.sep, '').split('.')[0],
				isInSubDir   : isSubDir,
				shortName,
				shortCamelName,
				globalName   : Configuration.shortVueDeclaration ? shortCamelName : camelName,
			});
		}
	}

	public static storeExportsObject(): StoreExportsImportsObject {
		return {
			imports : PluginManager.pluginStoreImportsObject(),
			exports : this.stores.map(store => ({
				exportConstName : store.globalName,
				constructorName : store.name,
			}))
		};
	}

	public static isStoreFile(file: string): boolean {
		return this.stores.some(store => file.includes(store.fileName));
	}

	public static generateStoreExportsFile() {
		this.storeExports = '';

		const exportsTemplate = getTemplate('vuestore-exports', Configuration.vueVersion);

		if (Configuration.vueVersion === 3) {
			this.storeExports += "import { inject } from 'vue';\n";
		}

		this.storeExports += PluginManager.pluginStoreImports + "\n";

		this.storeExports += this.stores.map(store => exportsTemplate
			.replaceAll('{{name}}', store.name)
			.replaceAll('{{camelName}}', store.camelName)
			.replaceAll('{{globalName}}', store.globalName),
		).join("\n");

		writeFile(Configuration.storesFilePath, this.storeExports);
	}


	public static generateTypeDefs() {
		let template = getTemplate('typedef', Configuration.vueVersion);

		template = template
			.replaceAll('{{imports}}', PluginManager.pluginStoreImports)
			.replaceAll('{{definitions}}',
				this.stores.map(m => `\t\t$${m.globalName} : ${m.name}`).join(",\n"),
			);

		writeFile(Configuration.definitionsFilePath, template);
	}
}

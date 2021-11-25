import path from "path";
import fs from "fs";
import {Configuration} from "../Configuration";
import {StoreManager} from "./StoreManager";
import {convertPathToImport, correctPackageImportName, getTemplate, writeFile} from "../Utilities";

export type PluginStoreImportsObject = {
	moduleName: string;
	importPath: string;
}

export class PluginManager {

	public static pluginStoreImports: string    = null;
	public static vuePluginStoreImports: string = null;

	public static pluginStoreImportsObject(): PluginStoreImportsObject[] {
		return StoreManager.stores
			.map(m => {
				const storePath = convertPathToImport(path.relative(
					path.resolve(...Configuration.pluginDirectory.split(path.sep)),
					m.absolutePath,
				).replace(Configuration.fileExtension, ''));

				return {
					moduleName : m.name,
					importPath : storePath,
				};
			});
	}

	public static generatePluginStoreImports() {
		this.pluginStoreImports = this.pluginStoreImportsObject()
			.map(m => {
				return `import {${m.moduleName}} from "${convertPathToImport(m.importPath)}";`;
			})
			.join("\n");

		let fileNamesImport = StoreManager.stores.map(m => m.globalName);

		if (Configuration.vueVersion === 3) {
			fileNamesImport.push(...StoreManager.stores.map(m => m.name + 'Symbol'));
		}

		this.vuePluginStoreImports = `import {${fileNamesImport.join(', ')}} from "./${convertPathToImport(Configuration.fileNames(false).stores)}"; \n`;
	}

	public static generatePlugin() {
		let template    = getTemplate('plugin', Configuration.vueVersion);
		let defTemplate = getTemplate('vuestore-definition', Configuration.vueVersion);

		if (Configuration.vueVersion === 2) {
			let vueCompApiTemplate = getTemplate('vue-composition-api-plugin', Configuration.vueVersion);

			writeFile(Configuration.vueCompositionInstallScriptFilePath, vueCompApiTemplate);
		}

		const definitions = StoreManager.stores.map(module => defTemplate
			.replaceAll('{{name}}', module.name)
			.replaceAll('{{camelName}}', module.camelName)
			.replaceAll('{{globalName}}', module.globalName),
		).join("\n");

		let imports = this.vuePluginStoreImports + this.pluginStoreImports;

		template = template
			.replaceAll('{{imports}}', imports)
			.replaceAll('{{definitions}}', definitions)
			.replaceAll('{{storeInits}}', StoreManager.stores.map(
				module => `${module.globalName}.setupStore();`
			).join("\n"));

		writeFile(Configuration.vueStorePluginFilePath, template);
	}

	public static generateStoreMetaFile() {
		writeFile(path.join(Configuration.pluginPath, 'stores.meta.json'), JSON.stringify(StoreManager.stores));
	}

	public static generateStoreClass() {
		let template = getTemplate('store', Configuration.vueVersion);

		const pluginPath = `./${Configuration.fileNames(false).plugin}`;

		template = template
			.replaceAll('{{pluginPath}}', pluginPath)
			.replaceAll('{{storeManagerImport}}', 'vue-class-stores'/*correctPackageImportName(path.join('..', '..', '..', '..', 'dist'))*/);

		writeFile(Configuration.storeClassFilePath, template);
	}

	public static generateVueCompositionApiExportsFile() {
		writeFile(
			Configuration.vueCompositionExportsFilePath,
			getTemplate('vue-composition-api-exports', Configuration.vueVersion),
		);
	}

	public static clearFiles() {
		Object.values(Configuration.fileNames(true)).forEach(name => {
			const filePath = path.join(...Configuration.pluginDirectory.split(path.sep), name);

			if (fs.existsSync(filePath)) {
				fs.rmSync(filePath);
			}
		});
	}


}

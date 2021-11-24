import {Configuration, PluginConfiguration} from "./Configuration";
import {PluginManager} from "./Managers/PluginManager";
import {StoreManager} from "./Managers/StoreManager";

export function generate(compilation?: any, configuration?: PluginConfiguration) {
	Configuration.setConfiguration(configuration);

	StoreManager.loadStores();

	if (Configuration.versionManager.isInvalidVersion()) {
		const ERROR = 'VUE VERSION IS NOT 2 OR 3. CANNOT USE VUE CLASS STORE PLUGIN.';

		if (compilation) {
			compilation.errors.push(new Error(ERROR));

			return;
		}

		throw new Error(ERROR);
	}

	//		PluginManager.clearFiles();

	PluginManager.generateVueCompositionApiExportsFile();

	PluginManager.generateStoreMetaFile();

	PluginManager.generateStoreClass();

	PluginManager.generatePluginStoreImports();

	StoreManager.generateStoreExportsFile();

	StoreManager.generateTypeDefs();

	PluginManager.generatePlugin();
}

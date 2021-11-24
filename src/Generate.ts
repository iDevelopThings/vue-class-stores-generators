import {Configuration, PluginConfiguration} from "./Configuration";
import {PluginManager} from "./Managers/PluginManager";
import {StoreManager} from "./Managers/StoreManager";
import chokidar from 'chokidar';
import {isInternallyGeneratedFile} from "./Utilities";

export function generate(compilation?: any, configuration?: PluginConfiguration) {
	if (!Configuration.hasPackageJsonConfig()) {
		console.warn('You do not have config set in package.json file. Please add the config values there also, read the docs for more info.');
		return;
	}

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


	console.log('Re-generated vue-class-store files.');
}

export function watch(configuration?: PluginConfiguration) {
	if (!Configuration.hasPackageJsonConfig()) {
		console.warn('You do not have config set in package.json file. Please add the config values there also, read the docs for more info.');
		return;
	}

	Configuration.setConfiguration(configuration);

	StoreManager.loadStores();

	generate(undefined, configuration);

	const watcher = chokidar.watch(Configuration.storesPath, {
		ignoreInitial : true,
		ignored       : Object.values(Configuration.fileNames(true, true))
	});

	watcher.on('all', (event, filename) => {

		if (event !== 'add' && event !== 'unlink' && event !== 'change') {
			return;
		}

		if (isInternallyGeneratedFile(filename)) {
			return;
		}

		generate(undefined, configuration);
	});
}

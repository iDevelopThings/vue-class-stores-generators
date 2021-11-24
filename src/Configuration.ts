import path from "path";
import {VueVersionManager} from "./Managers/VueVersionManager";

const packageJson = require(path.resolve(process.cwd(), 'package.json'));

export type FileNames = {
	stores: string,
	definitions: string;
	plugin: string;
	storeClass: string;
	vueCompApi: string;
	vueCompApiExports: string;
}

export type PluginConfiguration = {
	usingTypescript?: boolean;
	pluginDirectory?: string;
	storesDirectory?: string;
	shortVueDeclaration?: boolean;
}

export type ConfigurationManagerConfiguration = {
	usingTypescript: boolean;
	pluginDirectory: string;
	storesDirectory: string;
	storesPath?: string;
	pluginPath?: string;
	shortVueDeclaration: boolean;
	versionManager: VueVersionManager,
	vueVersion: 2 | 3;
	fileExtension: string;
	storesFilePath?: string;
	definitionsFilePath?: string;
	vueStorePluginFilePath?: string;
	storeClassFilePath?: string;
}

export class Configuration {

	public static usingTypescript: boolean;
	public static pluginDirectory: string;
	public static storesDirectory: string;
	public static storesPath?: string;
	public static pluginPath?: string;
	public static shortVueDeclaration: boolean;
	public static versionManager: VueVersionManager;
	public static vueVersion: 2 | 3;
	public static fileExtension: string;
	public static storesFilePath?: string;
	public static definitionsFilePath?: string;
	public static vueStorePluginFilePath?: string;
	public static vueCompositionInstallScriptFilePath?: string;
	public static vueCompositionExportsFilePath?: string;
	public static storeClassFilePath?: string;

	public static setConfiguration(configuration?: PluginConfiguration) {

		this.usingTypescript     = false;
		this.pluginDirectory     = path.join('src', 'Stores', 'Plugin');
		this.storesDirectory     = path.join('src', 'Stores');
		this.shortVueDeclaration = false;
		this.versionManager      = new VueVersionManager();
		this.vueVersion          = VueVersionManager.get().getVersion();
		this.fileExtension       = '.js';

		if (configuration === undefined) {
			if(this.hasPackageJsonConfig()) {
				configuration = this.getPackageJsonConfig();
			}
		}

		this.setupConfiguration(configuration);
	}

	public static getPackageJsonConfig() {
		return packageJson["vue-class-stores"] || {};
	}

	public static hasPackageJsonConfig() {
		const packageJsonConfig = packageJson["vue-class-stores"];

		return packageJsonConfig !== undefined;
	}

	public static set(key: keyof ConfigurationManagerConfiguration, value: any) {
		//@ts-ignore
		this[key] = value;
	}

	private static setupConfiguration(configuration: PluginConfiguration) {

		// Set the main configurations that were passed to the plugin
		for (let key of Object.keys(configuration)) {

			if (configuration[key] === undefined) {
				continue;
			}

			this.set(
				key as keyof ConfigurationManagerConfiguration,
				configuration[key]
			);
		}

		// Lets now configure any additional configs
		this.fileExtension = configuration.usingTypescript ? '.ts' : '.js';
		this.storesPath    = path.resolve(...this.storesDirectory.split(path.sep));
		this.pluginPath    = path.resolve(...this.pluginDirectory.split(path.sep));

		this.storesFilePath = path.resolve(
			...this.pluginDirectory.split(path.sep),
			this.fileNames(true).stores,
		);

		this.definitionsFilePath = path.resolve(
			...this.pluginDirectory.split(path.sep),
			this.fileNames(true).definitions,
		);

		this.vueStorePluginFilePath = path.resolve(
			...this.pluginDirectory.split(path.sep),
			this.fileNames(true).plugin,
		);

		this.vueCompositionExportsFilePath = path.resolve(
			...this.pluginDirectory.split(path.sep),
			this.fileNames(true).vueCompApiExports,
		);

		this.vueCompositionInstallScriptFilePath = path.resolve(
			...this.pluginDirectory.split(path.sep),
			this.fileNames(true).vueCompApi,
		);

		this.storeClassFilePath = path.resolve(
			...this.pluginDirectory.split(path.sep),
			this.fileNames(true).storeClass,
		);
	}

	public static fileNames(withExtensions = false, absolutePath = false): FileNames {
		const fileNames = {
			stores            : 'VueStores',
			definitions       : 'VueClassStoresPluginTypes.d.ts',
			plugin            : 'VueClassStoresPlugin',
			storeClass        : 'Store',
			vueCompApi        : 'InstallVueCompositionApi',
			vueCompApiExports : 'VueCompositionApiExports',
		};

		if (absolutePath) {
			fileNames.storeClass        = path.join(this.pluginDirectory, fileNames.storeClass);
			fileNames.stores            = path.join(this.pluginDirectory, fileNames.stores);
			fileNames.definitions       = path.join(this.pluginDirectory, fileNames.definitions);
			fileNames.plugin            = path.join(this.pluginDirectory, fileNames.plugin);
			fileNames.vueCompApi        = path.join(this.pluginDirectory, fileNames.vueCompApi);
			fileNames.vueCompApiExports = path.join(this.pluginDirectory, fileNames.vueCompApiExports);
		}

		if (withExtensions) {
			fileNames.storeClass += this.fileExtension;
			fileNames.stores += this.fileExtension;
			fileNames.plugin += this.fileExtension;
			fileNames.vueCompApi += this.fileExtension;
			fileNames.vueCompApiExports += this.fileExtension;
		}


		return fileNames;
	}
}

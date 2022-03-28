import path from "path";
import PackageJsonFile from "./Managers/PackageJsonFile";
import {VueVersionManager} from "./Managers/VueVersionManager";

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
	vueVersion: 2 | 3;
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

	public static projectRoot = null;

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
		PackageJsonFile.load();

		this.projectRoot         = process.cwd();
		this.usingTypescript     = false;
		this.pluginDirectory     = path.join(this.projectRoot, 'src', 'Stores', 'Plugin');
		this.storesDirectory     = path.join(this.projectRoot, 'src', 'Stores');
		this.shortVueDeclaration = false;

		this.versionManager = new VueVersionManager();
		if (!PackageJsonFile.canLoadPackageJson() && configuration?.vueVersion) {
			this.versionManager.setVersion(configuration.vueVersion);
		}
		this.vueVersion    = VueVersionManager.get().getVersion();
		this.fileExtension = '.js';

		if (!configuration && PackageJsonFile.canLoadPackageJson()) {
			configuration = PackageJsonFile.getPluginConfig();
		}

		this.setupConfiguration(configuration);
	}

	public static hasPackageJsonConfig() {
		return PackageJsonFile.canLoadPackageJson();
	}

	public static set(key: keyof ConfigurationManagerConfiguration, value: any) {
		//@ts-ignore
		this[key] = value;
	}

	private static resolvePathFromRoot(p: string): string {
		return path.resolve(path.join(this.projectRoot, ...p.split(path.sep)));
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
		this.storesPath    = this.resolvePathFromRoot(this.storesDirectory);
		this.pluginPath    = this.resolvePathFromRoot(this.pluginDirectory);

		const fileNames = this.fileNames(true, true);

		this.storesFilePath                      = this.resolvePathFromRoot(fileNames.stores);
		this.definitionsFilePath                 = this.resolvePathFromRoot(fileNames.definitions);
		this.vueStorePluginFilePath              = this.resolvePathFromRoot(fileNames.plugin);
		this.vueCompositionExportsFilePath       = this.resolvePathFromRoot(fileNames.vueCompApiExports);
		this.vueCompositionInstallScriptFilePath = this.resolvePathFromRoot(fileNames.vueCompApi);
		this.storeClassFilePath                  = this.resolvePathFromRoot(fileNames.storeClass);
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

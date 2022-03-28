import PackageJsonFile from "./PackageJsonFile";

let instance: VueVersionManager = null;

export class VueVersionManager {
	private version: 2 | 3 = null;

	constructor() {
		if(PackageJsonFile.canLoadPackageJson()) {
			this.version = PackageJsonFile.getVuePackageVersion();
		}

		instance = this;
	}

	static get(): VueVersionManager {
		return instance;
	}

	getVersion() {
		return this.version;
	}

	isVue3() {
		return this.getVersion() === 3;
	}

	isVue2() {
		return this.getVersion() === 2;
	}

	isInvalidVersion() {
		return this.getVersion() === null;
	}

	public setVersion(vueVersion: 2 | 3): void {
		this.version = vueVersion;
	}
}

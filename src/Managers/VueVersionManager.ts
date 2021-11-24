import path from "path";

const semver      = require('semver');
const packageJson = require(path.resolve(process.cwd(), 'package.json'));

let instance: VueVersionManager = null;

export class VueVersionManager {
	private version: 2 | 3 = null;

	constructor() {
		const deps = {...packageJson.dependencies, ...packageJson.devDependencies};

		if (!deps?.vue) {
			console.error('Vuejs is not found in package.json.\nPlease run:\nnpm install vue@next - for vue 3\nnpm install vue - for vue 2');
			return;
		}

		const version = semver.coerce(deps.vue);

		if (version.major !== 2 && version.major !== 3) {
			return;
		}

		this.version = version?.major ?? null;

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

}

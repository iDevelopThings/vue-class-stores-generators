import fs from "fs";
import path from "path";

const semver = require('semver');

export class PackageJsonFileManager {
	public json: any                       = null;
	public deps: { [key: string]: string } = {};

	load() {
		if (fs.existsSync(path.resolve(process.cwd(), 'package.json'))) {
			return;
		}

		this.json = require(path.resolve(process.cwd(), 'package.json'));
		this.deps = {...(this.json.dependencies || {}), ...(this.json.devDependencies || {})};
	}

	canLoadPackageJson() {
		return this.json !== null;
	}

	getPluginConfig() {
		return this.json['vue-class-stores'] ?? null;
	}

	getVuePackageVersion() {
		if (!this.deps?.vue) {
			console.error('Vuejs is not found in package.json.\nPlease run:\nnpm install vue@next - for vue 3\nnpm install vue - for vue 2');
			return null;
		}

		const version = semver.coerce(this.deps.vue);
		if (version.major !== 2 && version.major !== 3) {
			return null;
		}

		return version?.major ?? null;
	}

}

export default new PackageJsonFileManager();

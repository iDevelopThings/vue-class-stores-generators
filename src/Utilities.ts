import fs from "fs";
import path from "path";
import {Configuration} from "./Configuration";

export type WalkDirectoryFile = {
	filePath: string,
	isSubDir: boolean,
}

/**
 * @param {string} directory
 * @param {boolean} isSubDir
 */
export const walkDirectory = (directory: string, isSubDir = false): WalkDirectoryFile[] => {
	const files = [];

	fs.readdirSync(directory).forEach((name) => {
		const filePath = path.join(directory, name);
		const stat     = fs.statSync(filePath);

		if (stat.isFile()) {
			if (!(/Store\.(ts|js)$/.test(name))) {
				return;
			}

			files.push({filePath, stat, isSubDir});
		} else if (stat.isDirectory()) {
			files.push(...walkDirectory(filePath, true));
		}
	});

	return files;
};

export const writeFile = (path: string, content: string) => {
	ensureDirectoryExists(path);

	fs.writeFileSync(path, content);
};

/**
 * Ensure that all of our directories exist...
 * if they don't, we'll create them
 *
 * @param {string} pathToPrepare
 */
export const ensureDirectoryExists = (pathToPrepare: string) => {
	const pathParts = pathToPrepare.split(path.sep);
	let pathBuilt   = pathParts[0];

	for (let pathPart of pathParts) {

		if (pathBuilt.includes(pathPart)) {
			continue;
		}
		if (pathPart.endsWith(Configuration.fileExtension)) {
			continue;
		}
		if (pathPart.endsWith('.json')) {
			continue;
		}

		let pathCheck = path.join(pathBuilt, pathPart);

		if (!pathCheck.endsWith(path.sep)) {
			pathCheck += path.sep;
		}
		if (!pathCheck.startsWith(path.sep)) {
			pathCheck = path.sep + pathCheck;
		}

		pathCheck = path.resolve(pathCheck);

		if (!fs.existsSync(pathCheck)) {
			fs.mkdirSync(pathCheck);
		}

		pathBuilt = path.join(pathBuilt, pathPart);
	}
};

export const camelize = (str) => {
	return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
		return index === 0 ? word.toLowerCase() : word.toUpperCase();
	}).replace(/\s+/g, '');
};

export const correctPackageImportName = (importString: string) => {
	let importStringResponse = importString;

	//Hacky fix to properly reference the packages directory
	if (!process.cwd().includes('/Packages/VueClassStore')) {
		importStringResponse = 'vue-class-stores';
	}

	if (importStringResponse.endsWith('vite-apptest') || importStringResponse.endsWith('apptest')) {
		importStringResponse = importStringResponse.replace('/vite-apptest', '');
		importStringResponse = importStringResponse.replace('/apptest', '');
	}
	return importStringResponse;
};

export const getTemplate = (name: string, vueVersion: number) => {
	let rootPackageDir = process.cwd();

	//Hacky fix to properly reference the packages directory
	if (!rootPackageDir.includes('/Packages/VueClassStore')) {
		rootPackageDir = path.join(process.cwd(), 'node_modules', 'vue-class-stores');
	}

	if (rootPackageDir.endsWith('vite-apptest') || rootPackageDir.endsWith('apptest')) {
		rootPackageDir = rootPackageDir.replace('/vite-apptest', '');
		rootPackageDir = rootPackageDir.replace('/apptest', '');
	}

	return fs.readFileSync(
		path.resolve(rootPackageDir, 'template', `vue${vueVersion}`, `${name}.template.txt`),
		{encoding : 'utf-8'},
	);
};


export const isInternallyGeneratedFile = file => {
	const files = Object.values(Configuration.fileNames(true, true));

	if (file.includes('stores.meta.json')) {
		return true;
	}

	for (let internalFile of files) {
		if (file.includes(path.resolve(internalFile)) || file.includes(internalFile)) {
			return true;
		}
	}

	return false;
};

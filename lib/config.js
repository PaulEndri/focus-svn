import fs from 'node:fs/promises';
import path from 'node:path';
import * as url from 'url';

class Config {
    static __dirname = url.fileURLToPath(new URL('.', import.meta.url));
    static ConfigName = 'config.json';
    static ConfigOptions = { encoding: 'utf-8' };

    #config = null;
    #configExists = false;

    get defaultConfigPath() {
        return path.join(Config.__dirname, Config.ConfigName.split('.').join('.default.'));
    }

    get configPath() {
        return path.join(Config.__dirname, Config.ConfigName);
    }

    async #hasConfig() {
        if (this.#configExists) {
            return true;
        }

        try {
            await fs.stat(this.configPath);
            this.#configExists = true;
        } catch (e) {
            this.#configExists = false;
        }

        return this.#configExists;
    }

    async #generateConfig() {
        const rawConfig = await fs.readFile(this.defaultConfigPath, Config.ConfigOptions);

        if (!rawConfig) {
            throw new Error(`Unable to find config at ${this.configPath}`);
        }

        return this.#writeConfig(JSON.parse(rawConfig));
    }

    async #writeConfig(config = {}) {
        const configToWrite = config ?? this.#config;
        this.#config = configToWrite;

        await fs.writeFile(this.configPath, JSON.stringify(configToWrite, null, 2), Config.ConfigOptions);


        return this.#config;
    }

    async getConfig() {
        if (this.#config) {
            return this.#config;
        }

        const configExists = await this.#hasConfig();

        if (!configExists) {
           return await this.#generateConfig();
        }

        const configString = await fs.readFile(this.configPath, Config.ConfigOptions);
        const configData = JSON.parse(configString);

        this.#config = configData;

        return this.#config;
    }

    async overwrite(configObject) {
        return await this.#writeConfig(configObject);
    }

    async save(key, value) {
        const newConfig = {
            ...this.#config,
            [key]: value
        };

        return await this.#writeConfig(newConfig);
    }

    log(...args) {
        if (!this.#config?.silent) {
            console.log(...args);
        }
    }
};

export const InstanceConfig = new Config();
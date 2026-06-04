import {App, PluginSettingTab, Setting} from "obsidian";
import WooHooPlugin from "./main";

export interface WooHooSettings {
	duration: number;
	gifSize: number;
	gifFolder: string;
}

export const DEFAULT_SETTINGS: WooHooSettings = {
	duration: 3000,
	gifSize: 250,
	gifFolder: ""
}

export class WooHooSettingTab extends PluginSettingTab {
	plugin: WooHooPlugin;

	constructor(app: App, plugin: WooHooPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Set Duration')
			.setDesc('How long the gif stay on the screen (in milliseconds)')
			.addText(text => text
				.setPlaceholder('3000')
				.setValue(this.plugin.settings.duration.toString())
				.onChange(async (value) => {
					this.plugin.settings.duration = Number(value);
					await this.plugin.saveData(this.plugin.settings);
				}));

		new Setting(containerEl)
			.setName('Set Gif Size')
			.setDesc('The width and Height of the gif (in pixels)')
			.addText(text => text
				.setPlaceholder('250')
				.setValue(this.plugin.settings.gifSize.toString())
				.onChange(async (value) => {
					this.plugin.settings.gifSize = Number(value);
					await this.plugin.saveData(this.plugin.settings);
				}));

		new Setting(containerEl)
			.setName('Pick a folder containing Gifs')
			.setDesc('Pick the folder which contains the gif you want to play')
			.addText(text => text
				.setPlaceholder('""')
				.setValue(this.plugin.settings.gifFolder.toString())
				.onChange(async (value) => {
					this.plugin.settings.gifFolder = String(value);
					await this.plugin.saveData(this.plugin.settings);
				})
			)

	}

}
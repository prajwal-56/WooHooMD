import { PluginSettingTab, Setting } from "obsidian";
export const DEFAULT_SETTINGS = {
    mySetting: 'default'
};
export class SampleSettingTab extends PluginSettingTab {
    plugin;
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        new Setting(containerEl)
            .setName('Settings #1')
            .setDesc('It\'s a secret')
            .addText(text => text
            .setPlaceholder('Enter your secret')
            .setValue(this.plugin.settings.mySetting)
            .onChange(async (value) => {
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
        }));
    }
}

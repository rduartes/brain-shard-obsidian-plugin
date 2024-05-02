import {App, PluginSettingTab, Setting} from "obsidian";
import BrainShardPlugin from "../main";

export class BrainShardSettingsTab extends PluginSettingTab {
	plugin: BrainShardPlugin;

	constructor(app: App, plugin: BrainShardPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Default Dash duration')
			.setDesc('These are the periods of time you will remain focused on one Vault Item.')
			.addText(text => text
				.setPlaceholder('dash duration in minutes')
				.setValue(this.plugin.settings.defaultDashDuration)
				.onChange(async (value) => {
					this.plugin.settings.defaultDashDuration = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Default Rest duration')
			.setDesc('This is the default duration for the resting periods between focus dashes.')
			.addText(text => text
				.setPlaceholder('Rest duration in minutes')
				.setValue(this.plugin.settings.defaultRestDuration)
				.onChange(async (value) => {
					this.plugin.settings.defaultRestDuration = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Default note property to store effort')
			.setDesc('This is the document property where the dash sessions will be added to. Must be numeric.')
			.addText(text => text
				.setPlaceholder('Note property')
				.setValue(this.plugin.settings.defaultTimeProperty)
				.onChange(async (value) => {
						this.plugin.settings.defaultTimeProperty = value;
						await this.plugin.saveSettings();
					}
				)
			)

		//todo: I should replace this with a search component
		new Setting(containerEl)
			.setName('Shard Path')
			.setDesc('This is the vault location where shards will be saved')
			.addText(text => text
				.setPlaceholder('Path')
				.setValue(this.plugin.settings.shardPath)
				.onChange(async (value) => {
						this.plugin.settings.shardPath = value;
						await this.plugin.saveSettings();
					}
				)
			)
	}
}

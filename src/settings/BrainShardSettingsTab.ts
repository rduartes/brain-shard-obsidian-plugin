import {App, PluginSettingTab, Setting} from "obsidian";
import BrainShardPlugin from "../main";
import {BrainShardSettings} from "./BrainShardSettings";
import {FolderSuggest} from '../suggesters/FolderSuggester';

export class BrainShardSettingsTab extends PluginSettingTab {
	plugin: BrainShardPlugin;
	settings: BrainShardSettings;

	constructor(app: App, plugin: BrainShardPlugin, settings:BrainShardSettings) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = settings;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h3', { text: "Shards Configuration" });

		new Setting(containerEl)
			.setName('Shard folder')
			.setDesc('New Shards will be stored in this folder')
			.addSearch(search => {
				new FolderSuggest(this.app, search.inputEl);

				search
					.setPlaceholder('Shard storage')
					.setValue(this.settings.shardStorage)
					.onChange( async (value) => {
						this.settings.shardStorage = value;
						await this.plugin.saveSettings();
					});
				}
			)

		containerEl.createEl('h3', { text: "Dash Configuration" });

		new Setting(containerEl)
			.setName('Default Dash duration')
			.setDesc('These are the periods of time you will remain focused on one Vault Item.')
			.addText(text => text
				.setPlaceholder('dash duration in minutes')
				.setValue(this.plugin.settings.defaultDashDuration)
				.onChange(async (value) => {
					this.settings.defaultDashDuration = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Default Rest duration')
			.setDesc('This is the default duration for the resting periods between focus dashes.')
			.addText(text => text
				.setPlaceholder('Rest duration in minutes')
				.setValue(this.plugin.settings.defaultRestDuration)
				.onChange(async (value) => {
					this.settings.defaultRestDuration = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Default note property to store effort')
			.setDesc('This is the document property where the dash sessions will be added to. Must be numeric.')
			.addText(text => text
				.setPlaceholder('Note property')
				.setValue(this.plugin.settings.defaultTimeProperty)
				.onChange(async (value) => {
					this.settings.defaultTimeProperty = value;
					await this.plugin.saveSettings();
				}));
	}
}

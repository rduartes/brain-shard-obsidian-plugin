import {App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting, TFile} from 'obsidian';
import {StartCounterModal} from "src/StartCounterModal";
import {FocusTimer} from "./src/FocusTimer";
import {Logger} from "./src/Logger";


// Remember to rename these classes and interfaces!

interface BrainShardSettings {
	defaultProperty: string;
	defaultRestDuration: string;
	defaultDashDuration: string;
}

const DEFAULT_SETTINGS: BrainShardSettings = {
	defaultDashDuration: '25',
	defaultRestDuration: '5',
	defaultProperty: 'Effort'
}

export default class BrainShardPlugin extends Plugin {
	settings: BrainShardSettings;
	statusBarEl: HTMLElement;
	focusTimer:FocusTimer;


	onTimerTick(elapsed: number, duration:number) {
		
		let message = '';

		if (elapsed == duration -1 ) {
			message = `Brain Shard Focus: Almost there! Only ${duration - elapsed} minute to go! Hang on, you can do it!`;
		} else {
			message = `Brain Shard Focus: ${elapsed} minutes of ${duration}.`;
		}
		Logger.log(this, message);
		this.statusBarEl.setText(message);
	}

	onTimerDashCompleted() {
		const activeFile:TFile | null = this.app.workspace.getActiveFile();
		if(activeFile) {
			this.app.fileManager.processFrontMatter(
				activeFile,
				(properties) => {
					Logger.log(properties)
				}
			);
		}
		Logger.log(this, 'Well done! Dash completed. Time to rest!');
	}

	async onload() {
		await this.loadSettings();

		Logger.shouldLog = true;

		this.focusTimer = new FocusTimer(this);
		this.focusTimer.onTick = this.onTimerTick.bind(this);
		this.focusTimer.onDashComplete = this.onTimerDashCompleted.bind(this);

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('baby', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			// new Notice('This is a notice!');
			new StartCounterModal(
				this.app,
				this.focusTimer,
				this.settings.defaultDashDuration
			).open();
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		this.statusBarEl = this.addStatusBarItem();
		this.statusBarEl.setText('BrainShard Plugin');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				//new StartCounterModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				Logger.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						//new StartCounterModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new BrainShardSettingsTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			Logger.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => Logger.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		// console.dir(this.settings);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class BrainShardSettingsTab extends PluginSettingTab {
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
				.setValue(this.plugin.settings.defaultProperty)
				.onChange(async (value) => {
					this.plugin.settings.defaultProperty = value;
					await this.plugin.saveSettings();
				}))
	}
}

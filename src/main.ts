import {Plugin, TFile} from 'obsidian';
import {StartCounterModal} from "src/StartCounterModal";
import {DashTimer} from "./DashTimer";
import {Logger} from "./Logger";
import {TimerState} from "./TimerState";
import {loadCommands, refreshSettings} from "./commands/LoadCommands";
import {BrainShardSettings, DEFAULT_SETTINGS} from "./settings/BrainShardSettings";
import {BrainShardSettingsTab} from "./settings/BrainShardSettingsTab";


export default class BrainShardPlugin extends Plugin {
	settings: BrainShardSettings;
	statusBarEl: HTMLElement;
	dashTimer:DashTimer;


	onTimerTick(elapsed: number, duration:number) {
		
		let message: string;

		if (elapsed == duration -1 ) {
			message = `Brain Shard Focus: Almost there! Only ${duration - elapsed} minute to go! Hang on, you can do it!`;
		} else {
			message = `Brain Shard Focus: ${elapsed} minutes of ${duration}.`;
		}
		//Logger.log(this, message);
		this.statusBarEl.setText(message);
	}

	async onTimerDashCompleted(dashDuration:number) {
		this.dashTimer.state = TimerState.Completed;
		const activeFile:TFile | null = this.app.workspace.getActiveFile();
		if(activeFile) {
			await this.app.fileManager.processFrontMatter(
				activeFile,
				(properties) => {
					properties[this.settings.defaultTimeProperty] += dashDuration;
				}
			);
		}
		this.statusBarEl.setText('Well done! Dash completed. Time to rest!');
		this.statusBarEl.removeClass("mod-clickable");
	}

	async onload() {
		await this.loadSettings();

		Logger.shouldLog = true;

		this.dashTimer = new DashTimer(this);
		this.dashTimer.onTick = this.onTimerTick.bind(this);
		this.dashTimer.onDashComplete = this.onTimerDashCompleted.bind(this);

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('baby', 'Brain Shard Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			// new Notice('This is a notice!');
			this.statusBarEl.addClass("mod-clickable");
			new StartCounterModal(
				this.app,
				this.dashTimer,
				this.settings.defaultDashDuration
			).open();
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		this.statusBarEl = this.addStatusBarItem();
		this.statusBarEl.setText('BrainShard Plugin');
		this.statusBarEl.onClickEvent((clickEvt: MouseEvent) => {

			if(![TimerState.Started, TimerState.Resumed, TimerState.Paused].includes(this.dashTimer.state)) return

			if(this.dashTimer.state == TimerState.Paused) {
				Logger.log(this, 'Message clicked: Resuming the timer');
				this.dashTimer.resume();
				this.statusBarEl.setText('Brain Shard: Dash resumed');
			} else {
				Logger.log(this, 'Message clicked: Pausing the timer');
				this.dashTimer.pause();
				this.statusBarEl.setText('Brain Shard: Dash paused');
			}
		});

		// This adds a simple command that can be triggered anywhere
		/*this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				//new StartCounterModal(this.app).open();
			}
		});*/

		loadCommands(this, this.settings);

		// This adds an editor command that can perform some operation on the current editor instance
		/*this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				Logger.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});*/
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		/*this.addCommand({
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
		});*/

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new BrainShardSettingsTab(this.app, this, this.settings));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		/*this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			Logger.log('click', evt);
		});*/

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => Logger.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		// console.dir(this.settings);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		refreshSettings(this.settings);
	}
}

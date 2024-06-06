import BrainShardPlugin from "./main";
import {Logger} from "./Logger";
import {TimerState} from "./TimerState";

export class DashTimer {

	focusDurationInMinutes:number;
	elapsedTime: number;
	plugin: BrainShardPlugin; //I need the plugin to access the status bar
	focusInterval: number;
	state: TimerState;
	startTime: number;
	wasPaused:boolean; //This property is used to verify whether a dash was paused, which means that it shouldn't be considered a dash (no rest and no registration of dashes)
	onTick:(elapsed:number, duration:number) => void;
	onDashComplete: (focusDurationInMinutes: number) => void;

	constructor(plugin:BrainShardPlugin) {
		this.plugin = plugin;
		this.state = TimerState.Stopped;
	}

	start(focusDuration: number) {
		Logger.log(this,`Timer starting with ${focusDuration} minutes`);
		this.focusDurationInMinutes = focusDuration;
		this.startTime = Date.now();
		this.elapsedTime = 0;
		this.focusInterval = window.setInterval(this.tick.bind(this), 1000);
		this.plugin.registerInterval(this.focusInterval);
		this.state = TimerState.Started;
	}

	pause() {
		Logger.log(this, "Pausing the timer");
		this.state = TimerState.Paused;
	}

	resume() {
		Logger.log(this, "Resuming the timer");
		this.state = TimerState.Resumed;
	}

	private tick() {
		//If the timer is stopped, paused or completed do not process it's tick
		if([TimerState.Stopped, TimerState.Paused, TimerState.Completed].includes(this.state) ) return;
		// If the timer is paused for too long it should get interrupted
		//Logger.log(this, `tick`, this.elapsedTime);
		this.elapsedTime = Math.floor((Date.now() - this.startTime) / 60000);
		if(this.elapsedTime == this.focusDurationInMinutes) {
			this.focusDashCompleted();
		}
		this.onTick(this.elapsedTime, this.focusDurationInMinutes);
	}

	private focusDashCompleted() {
		clearInterval(this.focusInterval);
		this.onDashComplete(this.focusDurationInMinutes);
	}
}

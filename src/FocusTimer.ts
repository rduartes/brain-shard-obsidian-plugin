import BrainShardPlugin from "../main";
import {Logger} from "./Logger";

export class FocusTimer {
	focusDurationInMinutes:number;
	elapsedTime: number;
	plugin: BrainShardPlugin; //I need the plugin to access the status bar
	focusInterval: number;
	onTick:(elapsed:number, duration:number) => void;
	onDashComplete:() => void;
	constructor(plugin:BrainShardPlugin) {
		this.plugin = plugin;
	}

	start(focusDuration: number) {
		Logger.log(this,`Timer starting with ${focusDuration} minutes`);
		this.focusDurationInMinutes = focusDuration;
		this.elapsedTime = 0;
		this.focusInterval = window.setInterval(this.tick.bind(this), 5000);
		this.plugin.registerInterval(this.focusInterval);
	}

	private tick() {
		Logger.log(this, `tick`, this.elapsedTime);
		this.elapsedTime += 1;
		if(this.elapsedTime == this.focusDurationInMinutes) {
			this.focusDashCompleted();
		}
		this.onTick(this.elapsedTime, this.focusDurationInMinutes);
	}

	private focusDashCompleted() {
		clearInterval(this.focusInterval);
		this.onDashComplete();
	}
}

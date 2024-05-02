import {App, Command} from "obsidian";
import {NewShardModal} from "../views/NewShardModal";

export class NewShardCommand implements Command {
	id = "newShardCommand";
	name = "New Shard";
	app: App;

	constructor(app: App) {
		this.app = app;
	}

	callback(): void {
		console.log("New Shard Command");
		new NewShardModal(this.app, result => console.log("New Shard Command", result)).open();
	}
}

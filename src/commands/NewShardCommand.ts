import {App, Command} from "obsidian";
import {NewShardModal} from "../views/NewShardModal";

export class NewShardCommand implements Command {
	id = "newShardCommand";
	name = "New Shard";
	app: App;
	shardPath: string;

	constructor(app: App, shardPath: string) {
		this.app = app;
		this.shardPath = shardPath;
	}

	callback(): void {
		console.log("New Shard Command");
		new NewShardModal(this.app, result => {
			console.log("New Shard Command", result);
			this.app.vault.create(`${this.shardPath}/${result}.md`, "").then(value => console.log("Shard Created"));
		}).open();
	}
}

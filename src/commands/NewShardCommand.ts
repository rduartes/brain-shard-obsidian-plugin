import {Command} from "obsidian";

export class NewShardCommand implements Command {
	id = "newShardCommand";
	name = "New Shard";

	callback(): void {
		console.log("New Shard Command");

	}

}

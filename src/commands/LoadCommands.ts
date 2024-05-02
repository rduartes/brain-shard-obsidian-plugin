import {Plugin} from "obsidian";
import {NewShardCommand} from "./NewShardCommand";

export function loadCommands(plugin: Plugin) {
	plugin.addCommand(new NewShardCommand(plugin.app));
}

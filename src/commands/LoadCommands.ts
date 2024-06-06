import {NewShardCommand} from "./NewShardCommand";
import BrainShardPlugin from "../main";
import {NewChildShardCommand} from "./NewChildShardCommand";

export function loadCommands(plugin: BrainShardPlugin) {
	plugin.addCommand(new NewShardCommand(plugin.app, plugin.settings.shardStorage, plugin.settings.shardTemplate));
	plugin.addCommand(new NewChildShardCommand(plugin.app, plugin.settings.shardStorage, plugin.settings.shardTemplate));
}

import {NewShardCommand} from "./NewShardCommand";
import BrainShardPlugin from "../main";

export function loadCommands(plugin: BrainShardPlugin) {
	plugin.addCommand(new NewShardCommand(plugin.app, plugin.settings.shardStorage, plugin.settings.shardTemplate));
}

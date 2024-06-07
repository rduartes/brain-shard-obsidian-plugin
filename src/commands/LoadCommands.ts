import {NewShardCommand} from "./NewShardCommand";
import BrainShardPlugin from "../main";
import {NewChildShardCommand} from "./NewChildShardCommand";
import {BrainShardSettings} from "../settings/BrainShardSettings";

let newShardCommand: NewShardCommand;
let newChildShardCommand: NewChildShardCommand;

//todo: Commands should check for the settings they depend on before executing. This should be done within the command
//and can be shared across different command. For instance Both the new shard and child shard depend on the shard storage setting
export function loadCommands(plugin: BrainShardPlugin, settings: BrainShardSettings) {
	newShardCommand = plugin.addCommand(new NewShardCommand(plugin.app, settings.shardStorage, settings.shardTemplate)) as NewShardCommand;
	newChildShardCommand = plugin.addCommand(new NewChildShardCommand(plugin.app, settings.shardStorage, settings.shardTemplate, settings.parentShardProp)) as NewChildShardCommand;
}

export function refreshSettings(settings: BrainShardSettings) {
	newShardCommand.shardPath = settings.shardStorage;
	newShardCommand.shardTemplate = settings.shardTemplate;
	newChildShardCommand.shardPath = settings.shardStorage;
	newChildShardCommand.shardTemplate = settings.shardTemplate;
	newChildShardCommand.shardParentProperty = settings.parentShardProp;
}

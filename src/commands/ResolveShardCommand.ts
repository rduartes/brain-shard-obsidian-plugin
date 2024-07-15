import {Command} from 'obsidian';
import {isActiveFileAShard} from '../validators/ShardValidators';

export class ResolveShardCommand implements Command {
	id = "ResolveShardCommand";
	name = "Resolve Shard";

	checkCallback(checking: boolean): boolean | void {
		if (isActiveFileAShard()) {
			if (!checking) {
				console.log('Resolving the Shard')
			} else {
				return true
			}
		} else {
			return false
		}
	}

}

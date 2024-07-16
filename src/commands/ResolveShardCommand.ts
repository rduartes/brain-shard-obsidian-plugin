import {App, Command, TFile} from 'obsidian';
import {isActiveFileAShard} from '../validators/ShardValidators';
import {ChooseDateModal} from '../views/ChooseDateModal';

export class ResolveShardCommand implements Command {

	constructor(app: App) {
		this.app = app;
	}

	app: App;
	id = "ResolveShardCommand";
	name = "Resolve Shard";

	checkCallback(checking: boolean): boolean | void {
		if (isActiveFileAShard()) {
			if (!checking) {
				console.log('Resolving the Shard');
				//1. Ask the user to provide a resolution date.
				new ChooseDateModal(this.app, (result: string) => {
					console.log(result);
					//2. Set the note's Status property to "Resolved".
					const activeFile: TFile | null = this.app.workspace.getActiveFile();
					this.app.fileManager.processFrontMatter(activeFile!, (props) => {
						props['Status'] = 'Resolved';
						//3. Set the note's Resolved property to the date indicated by the user
					});
				}).open();
			} else {
				return true
			}
		} else {
			return false
		}
	}

}

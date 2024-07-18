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
					this.updateFrontMatter(result).then(() => console.log('Frontmatter updated'));
				}).open();
			} else {
				return true
			}
		} else {
			return false
		}
	}

	private async updateFrontMatter(resolutionDate: string) {
		const activeFile: TFile | null = this.app.workspace.getActiveFile();
		if(activeFile) {
			try {
				await this.app.fileManager.processFrontMatter(activeFile, frontmatter => {
					frontmatter['Status'] = 'Resolved';
					frontmatter['Resolved'] = resolutionDate;
				})
			} catch (error) {
				console.log('Error processing frontmatter', error);
			}
		} else {
			console.log('Could not access a valid active file');
		}
	}

}

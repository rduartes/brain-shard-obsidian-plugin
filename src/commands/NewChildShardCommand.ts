import {App, Command, TFile} from "obsidian";
import {NewShardModal} from "../views/NewShardModal";
import {Logger} from "../Logger";

export class NewChildShardCommand implements Command {
	id = "newChildShardCommand";
	name = "New Child Shard";
	app: App;
	shardPath: string;
	shardTemplate: string;

	constructor(app: App, shardPath: string, shardTemplate: string) {
		this.app = app;
		this.shardPath = shardPath;
		this.shardTemplate = shardTemplate;
	}

	checkCallback(checking: boolean): boolean | void {
		//Check if the current file is valid

		const activeFile = this.app.workspace.getActiveFile();
		const fileContents= activeFile ? this.app.metadataCache.getFileCache(activeFile) : null;

		if(fileContents?.frontmatter && 'Shard' in fileContents.frontmatter) {
			if(!checking) {

				new NewShardModal(this.app, async result => {
					//get template content
					//todo: In the interest of robustness we shouldn't assume the template path exists or is a valid Markup file
					const templateContent: string = await this.app.vault.cachedRead((this.app.vault.getAbstractFileByPath(this.shardTemplate) as TFile));
					//todo: It could be interesting to at least perform the basic template parsing that plain Obsidian templating engine does.

					//todo: If the file already exists, warn the user.
					this.app.vault.create(`${this.shardPath}/${result}.md`, templateContent).then(file => {
						console.log("Child Shard Created");
						//Todo: Maybe add a setting to choose whether the user wants to open the file or not.
						this.app.workspace.getLeaf().openFile(file)
					});
				}).open();
			} else {
				return true;
			}
		} else {
			return false;
		}
	}

	callback()  {



	}
}

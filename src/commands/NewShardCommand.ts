import {App, Command, TFile} from "obsidian";
import {NewShardModal} from "../views/NewShardModal";

export class NewShardCommand implements Command {
	id = "newShardCommand";
	name = "New Shard";
	app: App;
	shardPath: string;
	shardTemplate: string;

	constructor(app: App, shardPath: string, shardTemplate: string) {
		this.app = app;
		this.shardPath = shardPath;
		this.shardTemplate = shardTemplate;
	}

	callback(): void {
	console.log("New Shard Command");

		new NewShardModal(this.app, async result => {
			console.log("Shard name", result);

			//get template content
			//todo: In the interest of robustness we shouldn't assume the template path exists or is a valid Markup file
			const templateContent: string = await this.app.vault.cachedRead((this.app.vault.getAbstractFileByPath(this.shardTemplate) as TFile));

			//todo: It could be interesting to at least perform the basic template parsing that plain Obsidian temaplating engine does.
			this.app.vault.create(`${this.shardPath}/${result}.md`, templateContent).then(file => {
				console.log("Shard Created");
				//Todo: Maybe add a setting to choose whether the user wants to open the file or not.
				this.app.workspace.getLeaf().openFile(file)
			});
		}).open();
	}
}

import {App, Modal, Setting} from "obsidian";

export class NewShardModal extends Modal {
	result: string;
	private readonly onSubmit: (result: string) => void;

	constructor(app: App, onSubmit: (result: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
		this.result = "";
	}


	onOpen() {
		const {contentEl} = this;
		const {titleEl} = this;

		titleEl.createEl("h3", {text: "New Shard"});

		new Setting(contentEl)
			.setName("Shard Name")
			.addText((text) => {
				text.onChange((value) => {
					this.result = value;
				})
				text.inputEl.addEventListener("keydown", (evt: KeyboardEvent) => {
					if(evt.key === 'Enter') {
						evt.preventDefault();
						this.close();
						this.onSubmit(this.result);
					}
				});
			})
			.addButton((btn) =>
				btn
					.setButtonText("Create")
					.setCta()
					.onClick(() => {
							this.close();
							this.onSubmit(this.result);
						}
					)
			);
	}


	onClose() {
		const {containerEl} = this;
		containerEl.empty();
	}
}

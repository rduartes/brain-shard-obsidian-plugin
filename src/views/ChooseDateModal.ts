import {App, Modal, Setting} from 'obsidian';

export class ChooseDateModal extends Modal {
	result: string;
	private readonly onSubmit: (result: string) => void;

	constructor(app:App, onSubmit:(result:string) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const {contentEl} = this;
		const {titleEl} = this;

		titleEl.createEl("h3", {text: "Resolution Date"});

		//todo: This could (should?) be replaced by a date picker
		new Setting(contentEl)
			.setName("Resolution Date")
			.addText((text) => {
				text.setValue(new Date().toJSON().substring(0, 10));
				text.onChange((value:string) => {
					this.result = value
				})
				text.inputEl.addEventListener("keydown", (evt:KeyboardEvent) => {
					if(evt.key === 'Enter') {
						evt.preventDefault();
						this.close();
						this.onSubmit(this.result);
					}
				})
			})
			.addButton((btn) =>
			btn
				.setButtonText("Submit")
				.setCta()
				.onClick(() => {
					this.close();
					this.onSubmit(this.result);
				})
			);
	}

	onClose() {
		const {containerEl} = this;
		containerEl.empty();
	}
}

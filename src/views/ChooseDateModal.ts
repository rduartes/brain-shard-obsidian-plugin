import {Modal, Setting} from 'obsidian';

export class ChooseDateModal extends Modal {
	result: Date;
	private readonly onSubmit: (result: Date) => void;

	onOpen() {
		const {contentEl} = this;
		const {titleEl} = this;

		titleEl.createEl("h3", {text: "Resolution Date"});

		new Setting(contentEl)
			.setName("Resolution Date")
			.addButton((btn) =>
			btn
				.setButtonText("Submit")
				.setCta()
				.onClick(() => {
					this.close();
				})
			);
	}

	onClose() {
		const {containerEl} = this;
		containerEl.empty();
	}
}

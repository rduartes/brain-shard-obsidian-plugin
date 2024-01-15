import {App, Modal, Setting} from "obsidian";

export class StartCounterModal extends Modal {

	time:number;

	onSubmit: (time: number) => void;

	constructor(app: App, onSubmit: (time: number) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		this.titleEl.createEl('h3', {text: 'Focused Work Time'});
		const {contentEl} = this;
		contentEl.createEl("h4", {text: "For how long do you want to focus?"});

		new Setting(contentEl)
			.setName("Time")
			.setDesc('(in minutes)')
			.addText((text) => {
				text.onChange((value) => {
					this.time = Number(value);
				})
			});

		new Setting(contentEl)
			.addButton((btn) =>
				btn.setButtonText("Start")
					.setCta() // cta - call to action (paints the button in the active color)
					.onClick(() => {
						this.close();
						this.onSubmit(this.time)
					})
			)
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

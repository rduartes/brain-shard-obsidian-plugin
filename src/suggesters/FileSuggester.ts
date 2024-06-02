import {AbstractInputSuggest, TFile} from "obsidian";

export class FileSuggest extends AbstractInputSuggest<TFile> {
	textInputEl: HTMLInputElement;

	protected getSuggestions(query: string): TFile[] | Promise<TFile[]> {
		const result: TFile[] = [];
		for (const abstractFile of this.app.vault.getFiles()) {
			if(abstractFile.path.includes(query)) {
				result.push(abstractFile);
			}
		}
		return result;
	}

	renderSuggestion(value: TFile, el: HTMLElement): void {
		el.createEl('span', {text: value.path});
	}

	selectSuggestion(value: TFile): void {
		this.textInputEl.value = value.path;
		this.textInputEl.trigger("input");
		this.close();
	}
}

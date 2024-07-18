export function isActiveFileAShard() {
	const activeFile = this.app.workspace.getActiveFile();
	const fileContents = activeFile ? this.app.metadataCache.getFileCache(activeFile) : null;

	return activeFile && fileContents?.frontmatter && 'Shard' in fileContents.frontmatter
}

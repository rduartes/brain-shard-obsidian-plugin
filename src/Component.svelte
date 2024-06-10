<script lang="ts">
	export let variable: number;
</script>

<h1>My View!</h1>
<p>A navigation view representing the vault's shards and respective children in a folder-and-file kind of way</p>
<div class="number">
	<span>My number is {variable}!</span>
	<div>And I'm super happy to be here!</div>
</div>

<style>
	.number {
		color: red;
	}
</style>

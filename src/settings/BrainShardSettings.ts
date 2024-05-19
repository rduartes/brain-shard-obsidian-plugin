export interface BrainShardSettings {
	shardStorage: string;
	defaultTimeProperty: string;
	defaultRestDuration: string;
	defaultDashDuration: string;
}

export const DEFAULT_SETTINGS: BrainShardSettings = {
	shardStorage: 'Brain Shards/Shards',
	defaultDashDuration: '25',
	defaultRestDuration: '5',
	defaultTimeProperty: 'Effort'
}

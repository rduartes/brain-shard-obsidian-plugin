export interface BrainShardSettings {
	shardStorage: string;
	shardTemplate: string;
	parentShardProp: string;
	defaultTimeProperty: string;
	defaultRestDuration: string;
	defaultDashDuration: string;
}

export const DEFAULT_SETTINGS: BrainShardSettings = {
	shardStorage: '',
	defaultDashDuration: '25',
	defaultRestDuration: '5',
	defaultTimeProperty: 'Effort',
	shardTemplate: '',
	parentShardProp: 'Parent Shard',
}

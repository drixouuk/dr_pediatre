import * as migration_20260709_072937 from './20260709_072937';
import * as migration_20260710_practice_info_global_to_collection from './20260710_practice_info_global_to_collection';

export const migrations = [
  {
    up: migration_20260709_072937.up,
    down: migration_20260709_072937.down,
    name: '20260709_072937'
  },
  {
    up: migration_20260710_practice_info_global_to_collection.up,
    down: migration_20260710_practice_info_global_to_collection.down,
    name: '20260710_practice_info_global_to_collection'
  },
];

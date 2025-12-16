import * as migration_20251210_163138 from './20251210_163138';
import * as migration_20251215_041627 from './20251215_041627';
import * as migration_20251216_231331 from './20251216_231331';
import * as migration_20251216_234311 from './20251216_234311';

export const migrations = [
  {
    up: migration_20251210_163138.up,
    down: migration_20251210_163138.down,
    name: '20251210_163138',
  },
  {
    up: migration_20251215_041627.up,
    down: migration_20251215_041627.down,
    name: '20251215_041627',
  },
  {
    up: migration_20251216_231331.up,
    down: migration_20251216_231331.down,
    name: '20251216_231331',
  },
  {
    up: migration_20251216_234311.up,
    down: migration_20251216_234311.down,
    name: '20251216_234311'
  },
];

import * as migration_20251210_163138 from './20251210_163138';
import * as migration_20251215_041627 from './20251215_041627';
import * as migration_20251216_231331 from './20251216_231331';
import * as migration_20251216_234311 from './20251216_234311';
import * as migration_20251217_003355 from './20251217_003355';
import * as migration_20251222_010624 from './20251222_010624';
import * as migration_20251222_201812 from './20251222_201812';
import * as migration_20260103_224722 from './20260103_224722';
import * as migration_20260109_035721 from './20260109_035721';
import * as migration_20260111_034202 from './20260111_034202';
import * as migration_20260111_201015 from './20260111_201015';

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
    name: '20251216_234311',
  },
  {
    up: migration_20251217_003355.up,
    down: migration_20251217_003355.down,
    name: '20251217_003355',
  },
  {
    up: migration_20251222_010624.up,
    down: migration_20251222_010624.down,
    name: '20251222_010624',
  },
  {
    up: migration_20251222_201812.up,
    down: migration_20251222_201812.down,
    name: '20251222_201812',
  },
  {
    up: migration_20260103_224722.up,
    down: migration_20260103_224722.down,
    name: '20260103_224722',
  },
  {
    up: migration_20260109_035721.up,
    down: migration_20260109_035721.down,
    name: '20260109_035721',
  },
  {
    up: migration_20260111_034202.up,
    down: migration_20260111_034202.down,
    name: '20260111_034202',
  },
  {
    up: migration_20260111_201015.up,
    down: migration_20260111_201015.down,
    name: '20260111_201015'
  },
];

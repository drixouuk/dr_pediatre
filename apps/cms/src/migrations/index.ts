import * as migration_20260710_064021 from "./20260710_064021";
import * as migration_20260716_fix_schedules_locales from "./20260716_fix_schedules_locales";
import * as migration_20260716_add_system_alerts from "./20260716_add_system_alerts";

export const migrations = [
  {
    up: migration_20260710_064021.up,
    down: migration_20260710_064021.down,
    name: "20260710_064021",
  },
  {
    up: migration_20260716_fix_schedules_locales.up,
    down: migration_20260716_fix_schedules_locales.down,
    name: "20260716_fix_schedules_locales",
  },
  {
    up: migration_20260716_add_system_alerts.up,
    down: migration_20260716_add_system_alerts.down,
    name: "20260716_add_system_alerts",
  },
];

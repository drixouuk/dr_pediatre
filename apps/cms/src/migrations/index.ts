import * as migration_20260710_064021 from './20260710_064021';
import * as migration_20260716_add_system_alerts from './20260716_add_system_alerts';
import * as migration_20260716_fix_schedules_locales from './20260716_fix_schedules_locales';
import * as migration_20260717_205700 from './20260717_205700';
import * as migration_20260720_add_patient_contact_fields from './20260720_add_patient_contact_fields';
import * as migration_20260721_add_vaccine_schedule_vaccinations from './20260721_add_vaccine_schedule_vaccinations';
import * as migration_20260721_add_calbookings from './20260721_add_calbookings';
import * as migration_20260722_add_specialty from './20260722_add_specialty';

export const migrations = [
  {
    up: migration_20260710_064021.up,
    down: migration_20260710_064021.down,
    name: '20260710_064021',
  },
  {
    up: migration_20260716_add_system_alerts.up,
    down: migration_20260716_add_system_alerts.down,
    name: '20260716_add_system_alerts',
  },
  {
    up: migration_20260716_fix_schedules_locales.up,
    down: migration_20260716_fix_schedules_locales.down,
    name: '20260716_fix_schedules_locales',
  },
  {
    up: migration_20260717_205700.up,
    down: migration_20260717_205700.down,
    name: '20260717_205700'
  },
  {
    up: migration_20260720_add_patient_contact_fields.up,
    down: migration_20260720_add_patient_contact_fields.down,
    name: '20260720_add_patient_contact_fields'
  },
  {
    up: migration_20260721_add_vaccine_schedule_vaccinations.up,
    down: migration_20260721_add_vaccine_schedule_vaccinations.down,
    name: '20260721_add_vaccine_schedule_vaccinations'
  },
  {
    up: migration_20260721_add_calbookings.up,
    down: migration_20260721_add_calbookings.down,
    name: '20260721_add_calbookings'
  },
  {
    up: migration_20260722_add_specialty.up,
    down: migration_20260722_add_specialty.down,
    name: '20260722_add_specialty'
  },
];

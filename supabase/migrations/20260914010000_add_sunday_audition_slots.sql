-- Add the new Sunday audition hour without changing or replacing any existing
-- reservation. The explicit existence check makes this migration safe to
-- re-run even on older deployments that predate the unique(day, time)
-- constraint in the current schema.
insert into public.auditions (day, time, status)
select new_slots.day, new_slots.time, new_slots.status
from (values
  ('Sunday', '6:00 PM', 'Available'),
  ('Sunday', '6:05 PM', 'Available'),
  ('Sunday', '6:10 PM', 'Available'),
  ('Sunday', '6:15 PM', 'Available'),
  ('Sunday', '6:20 PM', 'Available'),
  ('Sunday', '6:25 PM', 'Available'),
  ('Sunday', '6:30 PM', 'Available'),
  ('Sunday', '6:35 PM', 'Available'),
  ('Sunday', '6:40 PM', 'Available'),
  ('Sunday', '6:45 PM', 'Available'),
  ('Sunday', '6:50 PM', 'Available'),
  ('Sunday', '6:55 PM', 'Available')
) as new_slots(day, time, status)
where not exists (
  select 1
  from public.auditions existing
  where existing.day = new_slots.day
    and existing.time = new_slots.time
);

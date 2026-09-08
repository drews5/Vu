-- Sends signup/cancellation notifications after an audition reservation changes.
-- Configure these settings in Supabase before expecting emails:
--   alter database postgres set app.audition_notify_url = 'https://<project-ref>.supabase.co/functions/v1/audition-notify';
--   alter database postgres set app.audition_webhook_secret = '<same value as AUDITION_WEBHOOK_SECRET>';
--   select pg_reload_conf();

create extension if not exists pg_net;

create or replace function public.notify_audition_reservation_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  webhook_url text := nullif(current_setting('app.audition_notify_url', true), '');
  webhook_secret text := nullif(current_setting('app.audition_webhook_secret', true), '');
  event_type text;
  singer_name text;
  singer_email text;
begin
  if tg_op <> 'UPDATE' then
    return new;
  end if;

  if (old.status is distinct from 'Booked' or old.name is null)
    and new.status = 'Booked'
    and new.name is not null then
    event_type := 'signup';
    singer_name := new.name;
    singer_email := new.email;
  elsif old.status = 'Booked'
    and old.name is not null
    and new.status = 'Available'
    and new.name is null then
    event_type := 'cancel';
    singer_name := old.name;
    singer_email := old.email;
  else
    return new;
  end if;

  if webhook_url is null or webhook_secret is null then
    return new;
  end if;

  perform net.http_post(
    url := webhook_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-audition-webhook-secret', webhook_secret
    ),
    body := jsonb_build_object(
      'event', event_type,
      'occurred_at', now(),
      'slot', jsonb_build_object(
        'id', new.id,
        'day', new.day,
        'time', new.time,
        'name', singer_name,
        'email', singer_email
      )
    ),
    timeout_milliseconds := 5000
  );

  return new;
end;
$$;

drop trigger if exists audition_reservation_notify on public.auditions;

create trigger audition_reservation_notify
after update on public.auditions
for each row
execute function public.notify_audition_reservation_change();

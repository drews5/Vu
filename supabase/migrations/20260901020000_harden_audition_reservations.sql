-- Keep all reservation decisions inside one database transaction. The functions
-- are idempotent so a mobile client can safely retry after losing a response.

-- Normalize reservations made by the compatibility client before direct table
-- updates are revoked below.
update public.auditions
set status = 'Booked'
where status = 'Available'
  and name is not null;

create or replace function public.book_audition_slot(
  p_slot_id uuid,
  p_name text,
  p_email text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  saved public.auditions%rowtype;
  clean_name text := btrim(p_name);
  clean_email text := lower(btrim(p_email));
begin
  if clean_name = '' or length(clean_name) > 100 then
    raise exception using errcode = 'P0001', message = 'Please enter a valid name.';
  end if;

  if clean_email !~ '^[^@[:space:]]+@umn[.]edu$' or length(clean_email) > 200 then
    raise exception using errcode = 'P0001', message = 'Please enter a valid UMN email.';
  end if;

  update public.auditions
  set name = clean_name,
      email = clean_email,
      status = 'Booked'
  where id = p_slot_id
    and status = 'Available'
    and name is null
  returning * into saved;

  if saved.id is null then
    select * into saved
    from public.auditions
    where id = p_slot_id;

    if saved.id is null then
      raise exception using errcode = 'P0001', message = 'That audition spot no longer exists.';
    end if;

    -- A repeated request after a lost response is a successful no-op.
    if saved.status is distinct from 'Booked'
      or saved.name is distinct from clean_name
      or lower(saved.email) is distinct from clean_email then
      raise exception using errcode = 'P0001', message = 'That spot was just reserved by someone else.';
    end if;
  end if;

  return jsonb_build_object(
    'id', saved.id,
    'day', saved.day,
    'time', saved.time,
    'status', saved.status,
    'name', saved.name
  );
end;
$$;

create or replace function public.cancel_audition_slot(
  p_slot_id uuid,
  p_email text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  saved public.auditions%rowtype;
  clean_email text := lower(btrim(p_email));
begin
  if clean_email !~ '^[^@[:space:]]+@umn[.]edu$' or length(clean_email) > 200 then
    raise exception using errcode = 'P0001', message = 'Please enter a valid UMN email.';
  end if;

  update public.auditions
  set name = null,
      email = null,
      status = 'Available'
  where id = p_slot_id
    and (status = 'Booked' or (status = 'Available' and name is not null))
    and lower(email) = clean_email
  returning * into saved;

  if saved.id is null then
    select * into saved
    from public.auditions
    where id = p_slot_id;

    if saved.id is null then
      raise exception using errcode = 'P0001', message = 'That audition spot no longer exists.';
    end if;

    -- A repeated cancellation after a lost response is a successful no-op.
    if saved.status <> 'Available' or saved.name is not null then
      raise exception using errcode = 'P0001', message = 'That UMN email does not match this reservation.';
    end if;
  end if;

  return jsonb_build_object(
    'id', saved.id,
    'day', saved.day,
    'time', saved.time,
    'status', saved.status,
    'name', saved.name
  );
end;
$$;

drop policy if exists "Update Auditions for Signup" on public.auditions;
revoke update on public.auditions from anon, authenticated;

revoke all on function public.book_audition_slot(uuid, text, text) from public;
revoke all on function public.cancel_audition_slot(uuid, text) from public;
grant execute on function public.book_audition_slot(uuid, text, text) to anon, authenticated;
grant execute on function public.cancel_audition_slot(uuid, text) to anon, authenticated;

-- Reservation emails are secrets used only inside cancel_audition_slot.
revoke select on public.auditions from anon, authenticated;
grant select (id, day, time, status, name, created_at) on public.auditions to anon, authenticated;

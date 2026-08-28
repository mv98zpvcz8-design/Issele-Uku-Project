-- Extensions and generic helper functions used by every later migration.

create extension if not exists pgcrypto;

-- Maintains `updated_at` on any table that has the column and attaches
-- this trigger. Kept generic so every table shares one implementation.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'BEFORE UPDATE trigger: stamps updated_at = now() on every row update.';

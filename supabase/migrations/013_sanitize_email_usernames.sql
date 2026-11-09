-- ============================================================
-- Privacy: legacy accounts whose username is an e-mail address expose that
-- address in their public profile URL (snowfans.org/<username>).
-- Rename them to the e-mail local part (ASCII only) + a short random suffix.
-- Idempotent: only touches usernames that still contain '@'.
-- ============================================================

do $$
declare
  r record;
  base text;
  candidate text;
begin
  for r in select id, username from profiles where username like '%@%' loop
    base := regexp_replace(split_part(r.username, '@', 1), '[^a-zA-Z0-9_]', '', 'g');
    if length(base) < 3 then
      base := 'user';
    end if;
    base := left(base, 24);

    loop
      candidate := base || '_' || substr(md5(random()::text), 1, 4);
      exit when not exists (select 1 from profiles where username = candidate);
    end loop;

    update profiles
       set username = candidate,
           short_link = lower(candidate)
     where id = r.id;
  end loop;
end $$;

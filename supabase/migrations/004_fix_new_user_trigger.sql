create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  _email_prefix text;
  _username text;
  _short_link text;
  _display_name text;
  _suffix int := 0;
begin
  _email_prefix := coalesce(split_part(new.email, '@', 1), '');
  _username := coalesce(
    new.raw_user_meta_data->>'username',
    nullif(_email_prefix, '')
  );

  -- Fallback if username is still empty
  if _username is null or _username = '' then
    _username := 'user' || floor(extract(epoch from now()))::text;
  end if;

  _short_link := lower(regexp_replace(_username, '[^a-zA-Z0-9]', '', 'g'));
  if _short_link = '' then
    _short_link := 'user' || floor(extract(epoch from now()))::text;
  end if;

  _display_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'display_name',
    _username
  );

  -- Handle username/short_link uniqueness conflicts
  loop
    begin
      insert into profiles (id, username, short_link, display_name, avatar_url)
      values (
        new.id,
        case when _suffix = 0 then _username else _username || _suffix::text end,
        case when _suffix = 0 then _short_link else _short_link || _suffix::text end,
        _display_name,
        new.raw_user_meta_data->>'avatar_url'
      );
      exit;
    exception when unique_violation then
      _suffix := _suffix + 1;
      if _suffix > 99 then exit; end if;
    end;
  end loop;

  return new;
end;
$$;

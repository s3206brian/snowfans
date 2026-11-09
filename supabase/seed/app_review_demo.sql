-- ============================================================
-- App Review demo content for the `reviewer` account (Guideline 2.1(a)):
-- Apple asked for a demo account with pre-populated content, incl. 私訊.
-- Idempotent: re-running replaces the demo rows instead of duplicating them.
--
-- The 私訊 counterpart is the developer's own account (looked up by e-mail
-- below); if it is not found, messages are skipped with a NOTICE.
-- ============================================================

do $$
declare
  rid uuid;          -- reviewer profile
  dev uuid;          -- developer profile (conversation partner)
  conv uuid;
  r_niseko uuid;
  r_hakuba uuid;
  r_naeba uuid;
begin
  select id into rid from profiles where username = 'reviewer';
  if rid is null then
    raise exception 'profile "reviewer" not found';
  end if;

  select p.id into dev
    from profiles p join auth.users u on u.id = p.id
   where u.email in ('briantsai@chengxun.org', 's3206brian@gmail.com')
   order by p.created_at
   limit 1;

  select id into r_niseko from resorts where name_zh = '二世谷' limit 1;
  select id into r_hakuba from resorts where name_zh like '白馬%' limit 1;
  select id into r_naeba  from resorts where name_zh = '苗場' limit 1;

  -- Profile card
  update profiles set
    display_name     = 'App Review',
    bio              = '這是提供 Apple App Review 使用的示範帳號。單板滑雪 4 年，喜歡粉雪與樹林。',
    trip_status      = 'finding_buddy',
    board_type       = 'snowboard',
    years_experience = 4,
    is_public        = true,
    eula_accepted_at = coalesce(eula_accepted_at, now())
  where id = rid;

  -- Trips (future dates so they appear in 探索 → 找行程)
  delete from trips where profile_id = rid;
  insert into trips (profile_id, resort_id, resort_name, start_date, end_date, status, description) values
    (rid, r_niseko, '二世谷', current_date + 30, current_date + 35, 'finding_buddy', '一月初去二世谷，找一起滑樹林的雪伴，程度中級以上。'),
    (rid, r_hakuba, '白馬',   current_date + 60, current_date + 64, 'learning',      '想加強刻滑，想找會中文的教練上 2 堂課。');

  -- Equipment (one listed for sale → appears in 探索 → 找裝備)
  delete from equipment where profile_id = rid;
  insert into equipment (profile_id, category, brand, model, year, notes, is_public, for_sale, sale_price) values
    (rid, 'board',   'Burton', 'Custom',      2024, '154 cm，主力板。',            true, false, null),
    (rid, 'boots',   'K2',     'Maysis',      2023, 'US 9，穿約 20 天。',          true, true,  4500),
    (rid, 'goggles', 'Oakley', 'Flight Deck', 2024, 'Prizm Snow Sapphire 鏡片。', true, false, null);

  -- Resort footprint
  delete from resort_visits where profile_id = rid;
  insert into resort_visits (profile_id, resort_id, visited_at, notes)
  select rid, x.resort_id, x.visited_at, x.notes
    from (values
      (r_niseko, date '2025-01-12', '粉雪超好'),
      (r_naeba,  date '2024-02-03', '第一次去日本滑雪')
    ) as x(resort_id, visited_at, notes)
   where x.resort_id is not null;

  -- 私訊
  if dev is null or dev = rid then
    raise notice 'developer account not found; skipping demo messages';
  else
    select id into conv from conversations
     where (user_a = rid and user_b = dev) or (user_a = dev and user_b = rid)
     limit 1;
    if conv is null then
      insert into conversations (user_a, user_b) values (dev, rid) returning id into conv;
    end if;
    delete from messages where conversation_id = conv;
    insert into messages (conversation_id, sender_id, body, read_at, created_at) values
      (conv, dev, '嗨！看到你一月要去二世谷，我們同一週也在，要不要一起滑？', now() - interval '2 hours', now() - interval '3 hours'),
      (conv, rid, '好啊！我主要滑 Hirafu 那側，你住哪邊？',                     now() - interval '2 hours', now() - interval '2 hours'),
      (conv, dev, '我也住 Hirafu，到時候在纜車站見 🏂',                         null,                       now() - interval '1 hour');
  end if;
end $$;

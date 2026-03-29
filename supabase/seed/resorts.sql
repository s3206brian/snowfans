-- Japan Ski Resorts (MVP seed data)
insert into resorts (name, name_zh, country, region, latitude, longitude) values
  ('Niseko United', '二世谷', 'Japan', 'Hokkaido', 42.8044, 140.6872),
  ('Rusutsu Resort', '留壽都', 'Japan', 'Hokkaido', 42.7519, 140.9067),
  ('Furano Ski Area', '富良野', 'Japan', 'Hokkaido', 43.3501, 142.3833),
  ('Hakuba Valley', '白馬', 'Japan', 'Nagano', 36.6983, 137.8600),
  ('Nozawa Onsen', '野沢溫泉', 'Japan', 'Nagano', 36.9167, 138.4500),
  ('Shiga Kogen', '志賀高原', 'Japan', 'Nagano', 36.7833, 138.5000),
  ('Myoko Kogen', '妙高高原', 'Japan', 'Niigata', 36.9167, 138.1167),
  ('Naeba Ski Resort', '苗場', 'Japan', 'Niigata', 36.8333, 138.6667),
  ('Zao Onsen Ski Resort', '藏王溫泉', 'Japan', 'Yamagata', 38.1833, 140.4500),
  ('Appi Kogen', '安比高原', 'Japan', 'Iwate', 39.8500, 141.0000);

-- Tags seed data
insert into tags (name, category) values
  ('初學者', 'skill'),
  ('中級', 'skill'),
  ('高級', 'skill'),
  ('自由式', 'style'),
  ('單板', 'style'),
  ('雙板', 'style'),
  ('貓道愛好者', 'style'),
  ('粉雪獵人', 'style'),
  ('找雪伴', 'general'),
  ('接受教學', 'general'),
  ('提供教學', 'general'),
  ('日本控', 'general');

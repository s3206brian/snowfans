insert into resorts (name, name_zh, country, region) values
-- 日本
('Niseko United', '二世谷', 'Japan', '北海道'),
('Rusutsu Resort', '留壽都', 'Japan', '北海道'),
('Furano Ski Resort', '富良野', 'Japan', '北海道'),
('Kiroro Snow World', 'キロロ', 'Japan', '北海道'),
('Tomamu Ski Resort', '星野度假村 TOMAMU', 'Japan', '北海道'),
('Sapporo Teine', '札幌手稻', 'Japan', '北海道'),
('Hakuba Valley', '白馬', 'Japan', '長野'),
('Nozawa Onsen', '野澤溫泉', 'Japan', '長野'),
('Shiga Kogen', '志賀高原', 'Japan', '長野'),
('Myoko Suginohara', '妙高杉之原', 'Japan', '新潟'),
('GALA Yuzawa', 'GALA湯澤', 'Japan', '新潟'),
('Naeba Ski Resort', '苗場', 'Japan', '新潟'),
('Kagura Ski Resort', '神樂滑雪場', 'Japan', '新潟'),
('Zao Onsen Ski Resort', '藏王溫泉', 'Japan', '山形'),
('Appi Kogen', '安比高原', 'Japan', '岩手'),
('Hakkoda', '八甲田', 'Japan', '青森'),
('Aomori Spring', '青森春季滑雪場', 'Japan', '青森'),
-- 韓國
('Yongpyong Resort', '龍平', 'South Korea', '江原道'),
('High1 Resort', 'High1', 'South Korea', '江原道'),
('Vivaldi Park Ski World', 'Vivaldi Park', 'South Korea', '江原道'),
('Bears Town', 'Bears Town', 'South Korea', '京畿道'),
('Jisan Forest Resort', '芝山', 'South Korea', '京畿道'),
-- 中國
('Yabuli Ski Resort', '亞布力', 'China', '黑龍江'),
('Beidahu Ski Resort', '北大壺', 'China', '吉林'),
('Wanlong Ski Resort', '萬龍', 'China', '河北'),
('Thaiwoo Ski Resort', '太舞', 'China', '河北'),
('Genting Snow Park', '頑雪嗨地', 'China', '河北'),
('Zhangjiakou Chongli', '崇禮', 'China', '河北'),
-- 北美
('Whistler Blackcomb', 'Whistler Blackcomb', 'Canada', 'British Columbia'),
('Banff Sunshine Village', 'Banff Sunshine', 'Canada', 'Alberta'),
('Lake Louise Ski Resort', 'Lake Louise', 'Canada', 'Alberta'),
('Park City Mountain', 'Park City', 'USA', 'Utah'),
('Vail Mountain', 'Vail', 'USA', 'Colorado'),
('Mammoth Mountain', 'Mammoth', 'USA', 'California'),
-- 歐洲
('Zermatt', '策馬特', 'Switzerland', 'Valais'),
('Verbier', '韋爾比耶', 'Switzerland', 'Valais'),
('Chamonix', '霞慕尼', 'France', 'Haute-Savoie'),
('Courchevel', '庫爾舍韋爾', 'France', 'Savoie'),
-- 澳紐
('Perisher Ski Resort', 'Perisher', 'Australia', 'New South Wales'),
('Thredbo Alpine Village', 'Thredbo', 'Australia', 'New South Wales'),
('Coronet Peak', 'Coronet Peak', 'New Zealand', 'Queenstown')
on conflict do nothing;

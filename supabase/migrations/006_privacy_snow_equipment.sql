-- Profile: public/private toggle
alter table profiles
  add column if not exists is_public boolean not null default true;

-- Resort visits: snow condition
alter table resort_visits
  add column if not exists snow_condition text
    check (snow_condition in ('powder','groomed','icy','wet','variable'));

-- Equipment: photos + sale info
alter table equipment
  add column if not exists image_urls text[] not null default '{}',
  add column if not exists for_sale boolean not null default false,
  add column if not exists sale_price numeric(10,0);

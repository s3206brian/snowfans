alter table resort_visits
  add column if not exists visited_end date;

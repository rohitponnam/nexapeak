create table leads (
  id               uuid default gen_random_uuid() primary key,
  name             text not null,
  email            text not null unique,
  company          text,
  role             text,
  source           text,
  page             text,
  message          text,
  email_step       int default 0,
  subscribed       boolean default true,
  created_at       timestamptz default now(),
  next_email_at    timestamptz,
  last_emailed_at  timestamptz
);

create index leads_next_email_idx on leads (next_email_at)
  where subscribed = true;

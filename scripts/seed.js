const { createClient } = require('@jsr/supabase__supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function setupAndSeed() {
  console.log('Starting database setup and seed...');

  // 1. Create Tables
  console.log('Creating tables...');
  const { error: rpcError } = await supabase.rpc('exec_sql', {
    sql_query: `
      create table if not exists members (
        id uuid default gen_random_uuid() primary key,
        name text unique not null,
        role text not null,
        part text not null,
        major text,
        year text,
        photo_url text,
        instagram text,
        display_order int default 0,
        is_vp boolean default false,
        created_at timestamp with time zone default now()
      );

      create table if not exists events (
        id uuid default gen_random_uuid() primary key,
        slug text unique not null,
        title text not null,
        date timestamp with time zone not null,
        display_time text,
        location text,
        address text,
        description text,
        image_url text,
        tag text,
        status text check (status in ('Upcoming', 'Previous')),
        is_featured boolean default false,
        ticket_link text,
        created_at timestamp with time zone default now()
      );

      create table if not exists auditions (
        id uuid default gen_random_uuid() primary key,
        day text not null,
        time text not null,
        status text check (status in ('Available', 'Booked', 'Break')) default 'Available',
        name text,
        email text,
        created_at timestamp with time zone default now(),
        unique(day, time)
      );

      alter table members enable row level security;
      alter table events enable row level security;
      alter table auditions enable row level security;

      drop policy if exists "Public Read Members" on members;
      drop policy if exists "Public Read Events" on events;
      drop policy if exists "Public Read Auditions" on auditions;
      drop policy if exists "Update Auditions for Signup" on auditions;

      create policy "Public Read Members" on members for select using (true);
      create policy "Public Read Events" on events for select using (true);
      create policy "Public Read Auditions" on auditions for select using (true);
      create policy "Update Auditions for Signup" on auditions for update using (status = 'Available');
    `
  });

  console.log('Seeding data...');

  // 1. Seed Members
  const members = [
    { name: 'Drew Scheid', role: 'President', part: 'Tenor', major: 'Information Systems', year: 'Junior', display_order: 1 },
    { name: 'Annika Horne', role: 'Music Director', part: 'Soprano', major: 'Psychology', year: 'Junior', display_order: 2 },
    { name: 'Sophia Lancaster', role: 'External Vice President', part: 'Mezzo', major: 'Marketing & Strategic Communications', year: 'Junior', display_order: 4 },
    { name: 'Thomas Herbert', role: 'Assistant Music Director', part: 'Tenor', major: 'Aerospace Engineering', year: 'Senior', display_order: 6 },
    { name: 'Tiffany Shen', role: 'Public Relations', part: 'Mezzo', major: 'Aerospace Engineering', year: 'Senior', display_order: 7 },
    { name: 'Maggie Roberts', role: 'Event Coordinator', part: 'Alto', major: 'Elementary Education', year: 'Sophomore', display_order: 8 },
    { name: 'Johnna Parks', role: 'Member', part: 'Soprano', major: 'Marketing', year: 'Senior', display_order: 9 },
    { name: 'Elise Clay', role: 'Member', part: 'Alto', major: 'Architecture', year: 'Junior', display_order: 10 },
    { name: 'Vivian Kahn', role: 'Member', part: 'Alto', major: 'Anthropology', year: 'Sophomore', display_order: 11 },
    { name: 'Gabriel Juenemann', role: 'Member', part: 'Tenor', major: 'Architecture', year: 'Junior', display_order: 12 },
    { name: 'William Nielsen', role: 'Member', part: 'Bass/Bari', major: 'Finance & Accounting', year: 'Senior', display_order: 13 },
    { name: 'Alexander Buhl', role: 'Member', part: 'Bass/Bari', major: 'Computer Science', year: 'Sophomore', display_order: 14 },
    { name: 'Daniel Ho', role: 'Member', part: 'Bass/Bari', major: 'Computer Science', year: 'Sophomore', display_order: 15, is_vp: true },
    { name: 'Aiden Ballard', role: 'Member', part: 'Bass/Bari', major: 'Theater', year: 'Senior', display_order: 16 },
    { name: 'Liv Murphy', role: 'Member', part: 'Mezzo', major: 'Marketing', year: 'Freshman', display_order: 17 },
    { name: 'Maddie Olsen', role: 'Member', part: 'Soprano', major: 'Sciences', year: 'Freshman', display_order: 18 },
  ];

  // Clear and re-insert
  await supabase.from('members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error: memberError } = await supabase.from('members').insert(members);
  if (memberError) console.error('Error seeding members:', memberError.message);
  else console.log('Members seeded successfully');

  // 2. Seed Events
  const events = [
    {
      slug: 'icca-quarterfinal-2026',
      title: 'ICCA Quarterfinal Competition',
      date: '2026-02-15T19:00:00Z',
      location: 'Ted Mann Concert Hall',
      address: '2128 S 4th St, Minneapolis, MN 55455',
      description: 'Join Vocal U as we compete in the ICCA Quarterfinals!',
      tag: 'MOST RECENT',
      status: 'Previous',
      is_featured: true,
      image_url: 'https://images.unsplash.com/photo-1760539619770-f58d0588db9e'
    },
    {
      slug: 'spring-showcase-2026',
      title: 'Spring Showcase',
      date: '2026-03-22T18:00:00Z',
      location: 'Northrop Auditorium',
      address: '84 Church St SE, Minneapolis, MN 55455',
      description: 'Our annual Spring Showcase is back!',
      tag: 'UPCOMING',
      status: 'Upcoming',
      is_featured: true,
      image_url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae'
    },
    {
      slug: 'winter-showcase-2025',
      title: 'Vocal U Winter Showcase',
      date: '2025-12-06T19:30:00Z',
      location: 'Cowles Auditorium',
      address: '301 19th Ave S, Minneapolis, MN 55455',
      description: 'A highlight of our winter season.',
      tag: 'HIGHLIGHT',
      status: 'Previous',
      is_featured: true,
      image_url: 'https://images.unsplash.com/photo-1689018161278-4e363b0c4a81'
    }
  ];

  const { error: eventError } = await supabase.from('events').upsert(events, { onConflict: 'slug' });
  if (eventError) console.error('Error seeding events:', eventError.message);
  else console.log('Events seeded successfully');

  // 3. Seed Auditions
  const generateSlots = (day) => {
    const slots = [];
    const startHour = 18; // 6 PM
    const endHour = 21; // 9 PM
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        const time = `${hour > 12 ? hour - 12 : hour}:${minute === 0 ? '00' : minute < 10 ? '0' + minute : minute} PM`;
        slots.push({ day, time, status: 'Available' });
      }
    }
    return slots;
  };

  const auditionSlots = [
    ...generateSlots('Wednesday'),
    ...generateSlots('Thursday')
  ];

  await supabase.from('auditions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error: auditionError } = await supabase.from('auditions').insert(auditionSlots);
  if (auditionError) console.error('Error seeding auditions:', auditionError.message);
  else console.log('Audition slots seeded successfully');

  console.log('Seeding complete!');
}

setupAndSeed();

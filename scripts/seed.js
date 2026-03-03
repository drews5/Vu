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
      slug: 'spring-showcase-2026',
      title: 'Spring Showcase',
      date: '2026-05-02T19:30:00Z',
      display_time: '7:30 PM',
      location: 'Cowles Auditorium',
      address: 'Humphrey School of Public Affairs, 301 19th Ave S, Minneapolis, MN 55455',
      description: 'Our annual Spring Showcase is back! Join us for an evening of music and performances.',
      tag: 'UPCOMING',
      status: 'Upcoming',
      is_featured: true,
      image_url: 'spring-showcase.jpg',
      ticket_link: null
    },
    {
      slug: 'ichsa-quarterfinal-4-2026',
      title: '2026 ICHSA Great Lakes Quarterfinal 4',
      date: '2026-02-21T19:00:00Z',
      display_time: '7:00 PM — 10:00 PM',
      location: 'Lakeville South High School',
      address: '21135 Jacquard Ave, Lakeville, MN 55044',
      description: `Featuring:
The AHS Accidentals (Arcadia High School)
The Accidentals (Southwest Christian High School)
Encore (Lakeville South High School)
Knight Club (Oak Creek High School)
Noteworthy (Jordan High School)
Out of the Blue (Gale-Ettrick-Trempealeau High School)
Red Knotes (Benilde-St. Margaret's High School)
Tonal Recall (Shell Lake High School)
Vocal Point (Gale-Ettrick-Trempealeau High School)

The top two finishing groups from this quarterfinal will advance to the ICHSA Great Lakes Semifinal. We invite you to Instagram this event using #ICHSA. Thanks!`,
      tag: 'UPCOMING',
      status: 'Upcoming',
      is_featured: true,
      image_url: 'ichsa-quarterfinal.jpg',
      ticket_link: 'https://www.varsityvocals.com/events/2026-ichsa-gl-qf4-lakeville-hs'
    },
    {
      slug: 'icca-quarterfinal-2026',
      title: '2026 ICCA Great Lakes Quarterfinal',
      date: '2026-02-14T19:00:00Z',
      display_time: '7:00 PM',
      location: 'Memorial Union',
      address: '800 Langdon St, Madison, WI 53706',
      description: 'Join Vocal U as we compete in the ICCA Great Lakes Quarterfinal in Madison!',
      tag: 'COMPETITION',
      status: 'Previous',
      is_featured: true,
      image_url: 'icca-2026.jpg'
    },
    {
      slug: 'night-songs',
      title: 'Night Songs',
      date: '2026-02-15T19:00:00Z',
      display_time: '7:00 PM — 8:30 PM',
      location: 'University Lutheran Church of Hope',
      address: 'Minneapolis, MN',
      description: 'An evening of music and poetry featuring the choirs of University Lutheran Church of Hope, First Congregational, University Baptist, and Vocal U. The sanctuary will have the night sky projected onto the rafters. Sit in the pews or bring pillows/blankets and lay on the floor to take in the view. This is a beautiful way to embrace winter for this family-friendly event. All are welcome.',
      tag: 'PAST',
      status: 'Previous',
      is_featured: true,
      image_url: 'night-songs.jpg'
    },
    {
      slug: 'icca-quarterfinal-2025',
      title: '2025 ICCA Great Lakes Quarterfinal',
      date: '2025-03-01T19:00:00Z',
      display_time: '7:00 PM',
      location: 'Memorial Union',
      address: '800 Langdon St, Madison, WI 53706',
      description: 'Our 2025 ICCA Quarterfinal performance in Madison.',
      tag: 'PAST COMPETITION',
      status: 'Previous',
      is_featured: true,
      image_url: 'icca-2025.jpg'
    },
    {
      slug: 'the-mix-2026',
      title: 'The Mix 2026!',
      date: '2026-05-15T18:00:00Z',
      display_time: '6:00 PM – 11:00 PM',
      location: 'O’Shaughnessy Distilling Co.',
      address: '600 Malcolm Ave. SE Minneapolis, MN 55414',
      description: `Join us for an unforgettable evening of generosity, connection, and celebration — The Mix 2026!

Hosted by Custom One Charities, this signature event brings together community leaders, partners, and friends to raise critical funds for families and children across Minnesota. Guests will enjoy live entertainment, craft cocktails, chef-inspired bites, live and silent auctions and one incredible cause.

The evening’s live entertainment includes a special performance by Vocal U, followed by an interactive magician and mind reader. The night concludes with a DJ-led after-party.

Dress Code: Stylish, warm, and sophisticated (tailored jackets, blazers, cocktail dresses).`,
      tag: 'UPCOMING',
      status: 'Upcoming',
      is_featured: true,
      image_url: 'https://customonemn.com/wp-content/uploads/2024/11/The-Mix-Banners_Desktop.png'
    },
    {
      slug: 'winter-showcase-2025',
      title: 'Vocal U Winter Showcase',
      date: '2025-12-06T19:30:00Z',
      display_time: '7:30 PM',
      location: 'Cowles Auditorium',
      address: '301 19th Ave S, Minneapolis, MN 55455',
      description: 'A highlight of our winter season.',
      tag: 'HIGHLIGHT',
      status: 'Previous',
      is_featured: true,
      image_url: 'winter-showcase.jpg'
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

    let totalMinutes = 0;
    const durationMinutes = (endHour - startHour) * 60;

    while (totalMinutes < durationMinutes) {
      const hour24 = startHour + Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;
      const time = `${hour24 > 12 ? hour24 - 12 : hour24}:${minute === 0 ? '00' : minute < 10 ? '0' + minute : minute} PM`;

      // Add a break every 45 minutes
      if (totalMinutes > 0 && totalMinutes % 45 === 0) {
        slots.push({ day, time, status: 'Break' });
      } else {
        slots.push({ day, time, status: 'Available' });
      }

      totalMinutes += 5; // Move to next 5-min slot
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

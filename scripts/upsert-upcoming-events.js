const upcomingEvents = [
  {
    slug: 'minnesota-state-fair-2026',
    title: 'Vocal U at the Minnesota State Fair',
    date: '2026-09-05T15:00:00-05:00',
    display_time: '10:00 AM',
    location: 'University of Minnesota Outdoor Stage',
    address: 'Minnesota State Fair, 1265 Snelling Ave N, St. Paul, MN 55108',
    description:
      'Catch Vocal U live at 10:00 AM on the University of Minnesota Outdoor Stage at the Minnesota State Fair. The stage is on the south side of Dan Patch Avenue between Underwood and Cooper streets.',
    image_url: 'group-photo.jpg',
    tag: 'UPCOMING',
    status: 'Upcoming',
    is_featured: true,
    ticket_link: 'https://www.mnstatefair.org/schedule/vocal-u',
  },
  {
    slug: 'fall-auditions-2026',
    title: 'Fall 2026 Auditions',
    date: '2026-09-16T18:00:00-05:00',
    display_time: 'September 16 & 17, 6:00-9:00 PM',
    location: 'University of Minnesota Twin Cities',
    address: 'Minneapolis, MN',
    description:
      'Come sing with Vocal U on September 16 or 17. Choose a live audition slot between 6:00 and 9:00 PM, prepare about 60 seconds of a contemporary song, and arrive 15 minutes early. Location details will be shared with singers.',
    image_url: 'group-photo.jpg',
    tag: 'SIGN UP',
    status: 'Upcoming',
    is_featured: true,
    ticket_link: null,
  },
  {
    slug: 'umn-homecoming-2026',
    title: 'UMN Homecoming 2026',
    date: '2026-10-19T13:00:00Z',
    display_time: 'Oct. 19–24 · Performance details coming soon',
    location: 'University of Minnesota Twin Cities',
    address: 'Minneapolis, MN',
    description:
      'Celebrate a week of Gopher tradition and spirit with Vocal U. Homecoming runs October 19–24; our performance details will be added as soon as they are announced.',
    image_url: 'group-photo.jpg',
    tag: 'DETAILS TBA',
    status: 'Upcoming',
    is_featured: true,
    ticket_link: 'https://homecoming.umn.edu/',
  },
];

module.exports = upcomingEvents;

if (require.main === module) {
  require('dotenv').config();
  const { createClient } = require('@jsr/supabase__supabase-js');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  supabase
    .from('events')
    .upsert(upcomingEvents, { onConflict: 'slug' })
    .select('slug,title,date,display_time,location,status')
    .then(({ data, error }) => {
      if (error) {
        throw error;
      }

      console.log(`Upserted ${data.length} upcoming events.`);
      for (const event of data) {
        console.log(`- ${event.title}`);
      }
    })
    .catch((error) => {
      console.error(`Could not upsert upcoming events: ${error.message}`);
      process.exitCode = 1;
    });
}

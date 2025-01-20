import { column, defineDb, defineTable, NOW } from 'astro:db';

const Guestbook = defineTable({
  columns: {
    username: column.text(),
    website: column.text({ optional: true }),
    body: column.text(),
    date: column.date({ default: NOW }),
  },
});

export default defineDb({
  tables: { Guestbook },
});

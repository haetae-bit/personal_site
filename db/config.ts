import { column, defineDb, defineTable, NOW } from 'astro:db';

const Guestbook = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    username: column.text(),
    website: column.text({ optional: true }),
    message: column.text(),
    published: column.date({ default: NOW }),
    updated: column.date({ optional: true }),
    reply: column.text({ optional: true }),
  }
});

export default defineDb({
  tables: {
    Guestbook,
  },
});
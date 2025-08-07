import { column, defineDb, defineTable, NOW } from 'astro:db';

const Guestbook = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    username: column.text(),
    website: column.text({ optional: true }),
    message: column.text({ multiline: true }),
    published: column.date({ default: NOW }),
    updated: column.date({ optional: true }),
    reply: column.text({ optional: true, multiline: true }),
  },
});

const Comment = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    postId: column.text(),
    replyId: column.number(),
    username: column.text(),
    website: column.text({ optional: true }),
    comment: column.text({ multiline: true }),
    published: column.date({ default: NOW }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { Guestbook, Comment },
});

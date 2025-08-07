import { db, Guestbook } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(Guestbook).values([
		{ id: 1, username: "test user", message: "this is a message!", published: new Date("2025-05-01") },
		{ id: 2, username: "heylo", website: "https://world.org", message: "hiii!!" },
	]);
}

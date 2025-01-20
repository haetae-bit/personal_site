import { db, Guestbook } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(Guestbook).values([
		{ username: "tester", website: "", body: "hey there!" },
		{ username: "ayo", website: "https://google.com", body: "this is googlebot" },
	]);
}

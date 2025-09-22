import { db } from "db";
import { guestbookTable } from "./schema";

export default async function seed() {
	await db.insert(guestbookTable).values([
		{ id: 1, username: "test user", message: "this is a message!" },
		{ id: 2, username: "heylo", website: "https://world.org", message: "hiii!!" },
	]);
}

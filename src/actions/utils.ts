export async function checkProfanity(message: string) {
  try {
    const response = await fetch("https://vector.profanity.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`There was an error checking your message: ${response.status}`);
    }

    const json = await response.json();

    if (json.isProfanity) {
      throw new Error("Please don't cuss!");
    }

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function checkSpam(form: FormData) {
  const token = form.append("procaptcha-response", import.meta.env.SPAM_SITE_KEY);
  
}
import type { APIContext } from "astro";
import { getImage } from "astro:assets";

const imagesGlob = import.meta.glob<{ default: ImageMetadata }>("/src/assets/**/*.{jpeg,jpg,png,webp,gif}");

export default async function (images: any[], context: APIContext) {
  for (const img of images) {
    const src = img.getAttribute("src");
    if (src?.startsWith("$/")) {
      const cleanedSrc = src.replace("$/", "");
      const imagePathPrefix = `/src/assets/${cleanedSrc}`;
      const imagePath = await imagesGlob[imagePathPrefix]();
      if (imagePath) {
        const optimizedImage = await getImage({ src: imagePath.default });
        img.setAttribute("src", context.site + optimizedImage.src.replace("/", ""));
      } else {
        throw Error("couldn't find image for rss feed!");
      }
    }
  }
}
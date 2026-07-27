import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Savorly",
    short_name: "Savorly",
    description:
      "A web scraper and recipe organizer that helps you declutter your digital recipe collection.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf6ef",
    theme_color: "#a34740",
    icons: [
      {
        src: "icon/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "icon/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "icon/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

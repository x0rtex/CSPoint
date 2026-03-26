import { Request, Response } from "express";
import { XMLParser } from "fast-xml-parser";

const HLTV_RSS_URL = "https://www.hltv.org/rss/news";

export const getHltvNews = async (_req: Request, res: Response) => {
  try {
    const response = await fetch(HLTV_RSS_URL, {
      headers: {
        "User-Agent": "CSPoint/1.0",
      },
    });

    if (!response.ok) {
      return res.status(502).json({ message: "Failed to fetch HLTV RSS" });
    }

    const xml = await response.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xml);

    const items = parsed?.rss?.channel?.item ?? [];
    const news = Array.isArray(items) ? items : [items];

    const mapped = news.map((item: any) => {
      const enclosureUrl = item.enclosure?.["@_url"];
      const mediaUrl = item["media:content"]?.["@_url"];
      const imageUrl = enclosureUrl || mediaUrl || undefined;

      return {
        title: item.title,
        link: item.link,
        date: item.pubDate,
        imageUrl,
        description: item.description,
      };
    });

    res.status(200).json(mapped);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Issue with fetching HLTV RSS: ${error.message}`);
    } else {
      console.error(`Issue with fetching HLTV RSS: ${error}`);
    }
    res.status(500).json({ message: "Failed to fetch HLTV news" });
  }
};

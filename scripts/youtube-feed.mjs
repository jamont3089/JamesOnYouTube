import { inferTags } from './tag-inference.mjs'

const atomFeedUrl = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCENTmbKaTphpWV2R2evVz2A'

function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function textFromEntry(entry, tag) {
  const match = entry.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))
  return match ? decodeXml(match[1].trim()) : ''
}

export function parseAtomFeed(feed) {
  return [...feed.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, entry]) => {
    const id = textFromEntry(entry, 'yt:videoId')
    const title = textFromEntry(entry, 'title')
    const description = textFromEntry(entry, 'media:description')
    const thumbnail = entry.match(/<media:thumbnail url="([^"]+)"/)?.[1] ?? ''

    return {
      id,
      title,
      description,
      publishedAt: textFromEntry(entry, 'published'),
      duration: '',
      thumbnailUrl: thumbnail,
      url: `https://www.youtube.com/watch?v=${id}`,
      tags: inferTags(title, description),
    }
  }).filter((video) => video.id && video.title && video.thumbnailUrl)
}

export async function getPublicFeedCatalog() {
  const response = await fetch(atomFeedUrl)
  if (!response.ok) {
    throw new Error(`Public YouTube feed request failed (${response.status}).`)
  }
  return parseAtomFeed(await response.text())
}

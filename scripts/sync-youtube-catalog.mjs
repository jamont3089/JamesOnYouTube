import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { inferTags } from './tag-inference.mjs'
import { getPublicFeedCatalog } from './youtube-feed.mjs'

const apiKey = process.env.YOUTUBE_API_KEY
const channelHandle = 'jamesmontemagno'
const outputPath = resolve('src/data/videos.json')
const apiBase = 'https://www.googleapis.com/youtube/v3'

async function youtube(path, parameters) {
  const url = new URL(`${apiBase}/${path}`)
  for (const [key, value] of Object.entries({ ...parameters, key: apiKey })) {
    url.searchParams.set(key, value)
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`YouTube API request failed (${response.status}): ${await response.text()}`)
  }
  return response.json()
}

function formatDuration(isoDuration) {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return ''
  const [, hours = '0', minutes = '0', seconds = '0'] = match
  const totalMinutes = Number(hours) * 60 + Number(minutes)
  return `${totalMinutes}:${Number(seconds).toString().padStart(2, '0')}`
}

async function getChannel() {
  const response = await youtube('channels', {
    part: 'contentDetails',
    forHandle: channelHandle,
  })
  const channel = response.items?.[0]
  if (!channel) throw new Error(`No channel was found for @${channelHandle}.`)
  return channel
}

async function getUploads(uploadsPlaylistId) {
  const items = []
  let pageToken

  do {
    const response = await youtube('playlistItems', {
      part: 'contentDetails,snippet',
      playlistId: uploadsPlaylistId,
      maxResults: '50',
      ...(pageToken ? { pageToken } : {}),
    })
    items.push(...response.items)
    pageToken = response.nextPageToken
  } while (pageToken && items.length < 100)

  return items.filter((item) => item.contentDetails.videoId)
}

async function getVideoDurations(videoIds) {
  const videoDetails = await Promise.all(
    Array.from({ length: Math.ceil(videoIds.length / 50) }, (_, index) =>
      youtube('videos', {
        part: 'contentDetails,status',
        id: videoIds.slice(index * 50, index * 50 + 50).join(','),
      }),
    ),
  )
  return new Map(
    videoDetails.flatMap((response) => response.items)
      .filter((video) => video.status.privacyStatus === 'public')
      .map((video) => [video.id, formatDuration(video.contentDetails.duration)]),
  )
}

let catalog
if (apiKey) {
  const channel = await getChannel()
  const uploads = await getUploads(channel.contentDetails.relatedPlaylists.uploads)
  const durations = await getVideoDurations(uploads.map((item) => item.contentDetails.videoId))

  catalog = uploads
    .filter((item) => durations.has(item.contentDetails.videoId))
    .map((item) => {
      const id = item.contentDetails.videoId
      const { title, description, publishedAt, thumbnails } = item.snippet
      return {
        id,
        title,
        description,
        publishedAt,
        duration: durations.get(id),
        thumbnailUrl: thumbnails.maxres?.url ?? thumbnails.high?.url ?? thumbnails.medium?.url,
        url: `https://www.youtube.com/watch?v=${id}`,
        tags: inferTags(title, description),
      }
    })
} else {
  catalog = await getPublicFeedCatalog()
  console.log('YOUTUBE_API_KEY is not set; using the public YouTube Atom feed (latest 15 uploads).')
}

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`)
console.log(`Wrote ${catalog.length} public videos to ${outputPath}`)

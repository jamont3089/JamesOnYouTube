import type { Video } from '../types'

export function getAllTags(videos: Video[]) {
  return [...new Set(videos.flatMap((video) => video.tags))].sort((left, right) =>
    left.localeCompare(right),
  )
}

export function filterVideos(videos: Video[], query: string, selectedTag: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase()

  return videos.filter((video) => {
    const matchesTag = selectedTag === 'All' || video.tags.includes(selectedTag)
    const searchableText = `${video.title} ${video.description} ${video.tags.join(' ')}`.toLocaleLowerCase()
    return matchesTag && (!normalizedQuery || searchableText.includes(normalizedQuery))
  })
}

export function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(value),
  )
}

import { describe, expect, it } from 'vitest'
import { filterVideos, getAllTags } from './videoDiscovery'
import type { Video } from '../types'

const videos: Video[] = [
  {
    id: 'maui',
    title: 'MAUI for beginners',
    description: 'Build mobile applications with .NET.',
    publishedAt: '2025-01-01T00:00:00Z',
    duration: '10:00',
    thumbnailUrl: '',
    url: '',
    tags: ['MAUI', 'Mobile'],
  },
  {
    id: 'azure',
    title: 'Azure fundamentals',
    description: 'A cloud introduction.',
    publishedAt: '2025-01-02T00:00:00Z',
    duration: '12:00',
    thumbnailUrl: '',
    url: '',
    tags: ['Azure', 'Cloud'],
  },
]

describe('video discovery', () => {
  it('returns alphabetized unique tags', () => {
    expect(getAllTags(videos)).toEqual(['Azure', 'Cloud', 'MAUI', 'Mobile'])
  })

  it('combines text search and tag filtering', () => {
    expect(filterVideos(videos, 'build', 'MAUI')).toEqual([videos[0]])
    expect(filterVideos(videos, 'cloud', 'All')).toEqual([videos[1]])
    expect(filterVideos(videos, 'Azure', 'Mobile')).toEqual([])
  })
})

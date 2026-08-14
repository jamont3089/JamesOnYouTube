import { useEffect, useMemo, useState } from 'react'
import videos from './data/videos.json'
import { filterVideos, formatPublishedDate, getAllTags } from './lib/videoDiscovery'
import type { Video } from './types'

const videoCatalog = [...videos].sort(
  (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
) as Video[]

function getInitialFilterState() {
  const params = new URLSearchParams(window.location.search)
  return {
    query: params.get('q') ?? '',
    tag: params.get('tag') ?? 'All',
  }
}

function App() {
  const initialState = getInitialFilterState()
  const [query, setQuery] = useState(initialState.query)
  const [selectedTag, setSelectedTag] = useState(initialState.tag)
  const tags = useMemo(() => ['All', ...getAllTags(videoCatalog)], [])
  const filteredVideos = useMemo(
    () => filterVideos(videoCatalog, query, selectedTag),
    [query, selectedTag],
  )
  const featuredVideo = videoCatalog[0]

  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (selectedTag !== 'All') params.set('tag', selectedTag)
    const search = params.toString()
    window.history.replaceState({}, '', `${window.location.pathname}${search ? `?${search}` : ''}`)
  }, [query, selectedTag])

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="James on YouTube home">
          <span className="brand-mark">J</span>
          <span>James on <strong>YouTube</strong></span>
        </a>
        <a className="channel-link" href="https://youtube.com/jamesmontemagno" target="_blank" rel="noreferrer">
          Visit channel <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Developer. Maker. Enthusiast.</p>
            <h1>Big ideas.<br /><em>Practical code.</em></h1>
            <p className="hero-summary">
              Explore videos from James Montemagno on .NET, mobile apps, cloud, and the tools that make building better.
            </p>
            <a className="primary-button" href="#explore">Explore videos <span aria-hidden="true">↓</span></a>
          </div>
          {featuredVideo && (
            <a className="featured-video" href={featuredVideo.url} target="_blank" rel="noreferrer">
              <img src={featuredVideo.thumbnailUrl} alt={`Thumbnail for ${featuredVideo.title}`} />
              <span className="play-button" aria-hidden="true">▶</span>
              <span className="featured-meta">
                <span>Latest spotlight</span>
                <strong>{featuredVideo.title}</strong>
              </span>
            </a>
          )}
        </section>

        <section className="explore" id="explore" aria-labelledby="explore-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Find your next build</p>
              <h2 id="explore-title">Explore the channel</h2>
            </div>
            <p className="result-count">{filteredVideos.length} video{filteredVideos.length === 1 ? '' : 's'} found</p>
          </div>

          <div className="filters">
            <label className="search-field">
              <span className="sr-only">Search videos</span>
              <span aria-hidden="true">⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search topics, tools, or ideas"
                type="search"
              />
            </label>
            <div className="tag-list" aria-label="Filter by topic">
              {tags.map((tag) => (
                <button
                  className={`tag ${tag === selectedTag ? 'active' : ''}`}
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {filteredVideos.length > 0 ? (
            <div className="video-grid">
              {filteredVideos.map((video) => <VideoCard key={video.id} video={video} />)}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">✦</span>
              <h3>No videos match that yet.</h3>
              <p>Try a different topic or clear your search to see everything.</p>
              <button type="button" onClick={() => { setQuery(''); setSelectedTag('All') }}>Clear filters</button>
            </div>
          )}
        </section>
      </main>

      <footer>
        <span>Made for curious developers.</span>
        <a href="https://youtube.com/jamesmontemagno" target="_blank" rel="noreferrer">@jamesmontemagno ↗</a>
      </footer>
    </div>
  )
}

function VideoCard({ video }: { video: Video }) {
  return (
    <article className="video-card">
      <a className="thumbnail" href={video.url} target="_blank" rel="noreferrer">
        <img src={video.thumbnailUrl} alt={`Thumbnail for ${video.title}`} />
        {video.duration && <span className="duration">{video.duration}</span>}
        <span className="card-play" aria-hidden="true">▶</span>
      </a>
      <div className="video-info">
        <div className="video-tags">{video.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <h3><a href={video.url} target="_blank" rel="noreferrer">{video.title}</a></h3>
        <p>{formatPublishedDate(video.publishedAt)}</p>
      </div>
    </article>
  )
}

export default App

const tagRules = [
  ['MAUI', /\b(maui|\.net maui)\b/i],
  ['.NET', /(?:(?:^|[^\w])\.net\b|\bdotnet\b|\basp\.net\b)/i],
  ['C#', /(?:\bc#(?=\s|$)|\bcsharp\b)/i],
  ['Azure', /\bazure\b/i],
  ['GitHub', /\b(github|copilot)\b/i],
  ['DevOps', /\b(devops|ci\/cd|continuous integration|github actions)\b/i],
  ['Mobile', /\b(mobile|android|ios|iphone|cross-platform)\b/i],
  ['Cloud', /\b(cloud|serverless|functions|container)\b/i],
  ['Productivity', /\b(tips|tricks|productivity|workflow|tools)\b/i],
]

export function inferTags(title, description) {
  const content = `${title} ${description}`
  const tags = tagRules.filter(([, expression]) => expression.test(content)).map(([tag]) => tag)
  return tags.length > 0 ? tags : ['Developer Life']
}

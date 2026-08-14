import assert from 'node:assert/strict'
import test from 'node:test'
import { inferTags } from './tag-inference.mjs'

test('infers every matching topic in predictable taxonomy order', () => {
  assert.deepEqual(
    inferTags('GitHub Copilot for .NET MAUI', 'Build mobile apps with C# and Azure.'),
    ['MAUI', '.NET', 'C#', 'Azure', 'GitHub', 'Mobile'],
  )
})

test('adds a useful fallback when no taxonomy rule matches', () => {
  assert.deepEqual(inferTags('Community update', 'A quick hello.'), ['Developer Life'])
})

const fs = require('fs')
const Directory = require('../../lib/directory')

test('can create directory', async () => {
  const directory = await Directory.create('tmp/new-directory')

  const directoryWasFound = fs.statSync('tmp/new-directory').isDirectory()

  expect(directoryWasFound).toBe(true)
  expect(directory.path).toContain('tmp/new-directory')
})
test('can delete directory', async () => {
  const directory = await Directory.create('tmp/new-directory-to-delete')
  await Directory.delete('tmp/new-directory-to-delete')
  expect(() => {
    fs.statSync('tmp/new-directory-to-delete')
  }).toThrow()
})

test('can move/rename directory', async () => {
  await Directory.create('tmp/directory-to-rename')
  await Directory.rename(
    'tmp/directory-to-rename',
    'tmp/directory-to-rename-new'
  )
  const directoryWasFound = fs
    .statSync('tmp/directory-to-rename-new')
    .isDirectory()

  expect(directoryWasFound).toBe(true)
})

test('can create parent directories if needed', async () => {
  await Directory.create('tmp/level1/level2/level3/level4')
  const directoryWasFound = fs
    .statSync('tmp/level1/level2/level3/level4')
    .isDirectory()

  expect(directoryWasFound).toBe(true)
})

// test('can search directory for files', async () => {
//   await Directory.create('tmp/directory-to-search/item1')
//   expect(true).toBe(false)
// })

// test('can search directory for content', async () => {
//   expect(true).toBe(false)
// })

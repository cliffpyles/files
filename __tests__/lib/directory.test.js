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

// test('can move/rename directory', async () => {
//   expect(true).toBe(false)
// })

// test('can search directory for files', async () => {
//   expect(true).toBe(false)
// })

// test('can search directory for content', async () => {
//   expect(true).toBe(false)
// })

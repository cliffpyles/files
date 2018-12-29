const fs = require('fs')
const File = require('../../lib/file')

test('can create files', async () => {
  const file = await File.create('tmp/new-file.txt')

  const fileWasFound = fs.statSync('tmp/new-file.txt').isFile()

  expect(fileWasFound).toBe(true)
  expect(file.filepath).toContain('tmp/new-file.txt')
})
test('can create a file with content', async () => {
  const file = await File.create('tmp/new-file-with-content.txt', 'Hello!')

  const fileOnDisk = fs.readFileSync('tmp/new-file-with-content.txt', 'utf8')

  expect(fileOnDisk).toBe('Hello!')
  expect(file.content).toBe('Hello!')
})

test('can open a file', async () => {
  await File.create('tmp/file-to-open.txt', 'has some content')
  const file = await File.open('tmp/file-to-open.txt')

  expect(file.filepath).toContain('tmp/file-to-open.txt')
  expect(file.content).toBe('has some content')
})

test('can update the contents of a file', async () => {
  await File.create('tmp/file-to-update.txt', 'original content')
  const updatedFile = await File.update('tmp/file-to-update.txt', file => {
    return file.content.replace('original', 'updated')
  })
  const updatedFileOnDisk = await File.open('tmp/file-to-update.txt')
  expect(updatedFile.content).toBe('updated content')
  expect(updatedFileOnDisk.content).toBe('updated content')
})

// test('can delete files', async () => {
//   expect(false).toBe(true)
// })

// test('can rename a file', async () => {
//   expect(false).toBe(true)
// })

// test('can find a value in files', async () => {
//   expect(false).toBe(true)
// })

// test('can find and replace a value in files', async () => {
//   expect(false).toBe(true)
// })

// test('can duplicate files', async () => {
//   expect(false).toBe(true)
// })

// test('can move a file', async () => {
//   expect(false).toBe(true)
// })

// afterEach(() => {})

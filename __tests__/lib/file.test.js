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

test('can delete files', async () => {
  await File.create('tmp/file-to-delete.txt')
  await File.delete('tmp/file-to-delete.txt')

  expect(() => {
    fs.statSync('tmp/file-to-delete.txt')
  }).toThrow()
})

test('can move/rename a file', async () => {
  await File.create('tmp/file-to-rename.txt')
  await File.rename('tmp/file-to-rename.txt', 'tmp/file-to-rename-new.txt')
  const fileWasFound = fs.statSync('tmp/file-to-rename-new.txt').isFile()

  expect(fileWasFound).toBe(true)
})

test('can search for a value in a file', async () => {
  await File.create(
    'tmp/file-to-search.txt',
    `
    line 1: example 1
    line 2: example 2
    line 3: example 3
    line 4: not a match 1
    line 5: not a match 2
  `
  )
  const results = await File.search('tmp/file-to-search.txt', 'example')

  expect(results).toBeArrayOfSize(3)
  expect(results[0].lineNumber).toBe(1)
  expect(results[1].lineNumber).toBe(2)
  expect(results[2].lineNumber).toBe(3)
})

test('can find and replace a value in files', async () => {
  const file = await File.create(
    'tmp/file-to-replace.txt',
    `
    example-1
    example-2
    example-3
  `
  )
  const updatedFile = await File.replace(
    'tmp/file-to-replace.txt',
    'example',
    'demo'
  )

  expect(updatedFile.content).toContain('demo-1')
  expect(updatedFile.content).toContain('demo-2')
  expect(updatedFile.content).toContain('demo-3')
})

test('can backup/duplicate files', async () => {
  const file = await File.create(
    'tmp/file-to-duplicate.txt',
    'contents of file'
  )
  const duplicatedFile = await File.duplicate('tmp/file-to-duplicate.txt')
  const duplicatedFileOnDisk = fs.readFileSync(duplicatedFile.filepath, 'utf8')
  expect(duplicatedFile.filepath).toContain('file-to-duplicate')
  expect(duplicatedFile.filepath).toContain('.txt')
  expect(duplicatedFileOnDisk).toContain('contents of file')
})

// afterEach(() => {})

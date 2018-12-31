const {
  copyFile,
  appendFile,
  writeFile,
  readFile,
  unlink,
  rename
} = require('fs')
const path = require('path')
class FileSearchResult {
  constructor({ searchQuery, filepath, lineNumber, line }) {
    this.searchQuery = searchQuery
    this.filepath = filepath
    this.lineNumber = lineNumber
    this.line = line
  }
}
class File {
  constructor(filepath, content = '') {
    this.filepath = path.resolve(filepath)
    this.content = content
  }

  static write(filepath, content = '') {
    const absoluteFilepath = path.resolve(filepath)

    return new Promise((resolve, reject) => {
      writeFile(absoluteFilepath, content, 'utf8', err => {
        if (err) {
          reject(err)
        }

        resolve(new File(absoluteFilepath, content))
      })
    })
  }

  static create(filepath, content = '') {
    return File.write(filepath, content)
  }

  static open(filepath) {
    const absoluteFilepath = path.resolve(filepath)

    return new Promise((resolve, reject) => {
      readFile(absoluteFilepath, 'utf8', (err, content) => {
        if (err) {
          reject(err)
        }

        resolve(new File(absoluteFilepath, content))
      })
    })
  }

  static async update(filepath, callback) {
    const absoluteFilepath = path.resolve(filepath)
    const file = await File.open(absoluteFilepath)
    const updatedContent = callback(file)

    return new Promise((resolve, reject) => {
      writeFile(file.filepath, updatedContent, 'utf8', err => {
        if (err) {
          reject(err)
        }

        resolve(new File(file.filepath, updatedContent))
      })
    })
  }

  static delete(filepath) {
    const absoluteFilepath = path.resolve(filepath)

    return new Promise((resolve, reject) => {
      unlink(absoluteFilepath, err => {
        if (err) {
          reject(err)
        }

        resolve({ success: true })
      })
    })
  }

  static move(existingFilepath, newFilepath) {
    const absoluteFilepath = path.resolve(existingFilepath)
    const newAbsoluteFilepath = path.resolve(newFilepath)

    return new Promise((resolve, reject) => {
      rename(absoluteFilepath, newAbsoluteFilepath, err => {
        if (err) {
          reject(err)
        }

        resolve(new File(newAbsoluteFilepath))
      })
    })
  }

  static rename(existingFilepath, newFilepath) {
    return File.move(existingFilepath, newFilepath)
  }

  static async search(filepath, searchQuery) {
    const SOURCE_REGEX = /^.*((\r\n|\n|\r)|$)/gm
    const file = await File.open(filepath)
    const source = file.content.trim().match(SOURCE_REGEX)

    const results = source.reduce((previousResults, line, index) => {
      if (line.includes(searchQuery)) {
        const lineNumber = index + 1
        return [
          ...previousResults,
          new FileSearchResult({
            searchQuery,
            filepath: file.filepath,
            lineNumber,
            line
          })
        ]
      }
      return previousResults
    }, [])

    return results
  }

  static async replace(filepath, searchQuery, replacementText) {
    const searchRegEx = new RegExp(searchQuery, 'gm')
    const file = await File.open(filepath)
    const updatedContent = file.content.replace(searchRegEx, replacementText)

    return File.write(filepath, updatedContent)
  }

  static duplicate(filepath) {
    const absoluteFilepath = path.resolve(filepath)
    const filepathSegments = path.parse(absoluteFilepath)

    return new Promise((resolve, reject) => {
      const currentTimestamp = Date.now()
      const newFilepath = path.resolve(
        filepathSegments.dir,
        `./${filepathSegments.name}.${currentTimestamp}${filepathSegments.ext}`
      )
      copyFile(absoluteFilepath, newFilepath, err => {
        if (err) {
          reject(err)
        }

        resolve(new File(newFilepath))
      })
    })
  }

  static async append(filepath, content) {
    const absoluteFilepath = path.resolve(filepath)
    return new Promise((resolve, reject) => {
      appendFile(absoluteFilepath, `\n\r${content}`, err => {
        if (err) {
          reject(err)
        }

        resolve(new File(absoluteFilepath))
      })
    })
  }

  static async prepend(filepath, content) {
    const absoluteFilepath = path.resolve(filepath)

    const updatedFile = await File.update(absoluteFilepath, file => {
      return `${content}\n\r${file.content}`
    })
  }
}

module.exports = File

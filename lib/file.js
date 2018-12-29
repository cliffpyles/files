const { writeFile, readFile } = require('fs')
const path = require('path')

class File {
  constructor(filepath, content = '') {
    this.filepath = path.resolve(filepath)
    this.content = content
  }

  static create(filepath, content = '') {
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
}

module.exports = File

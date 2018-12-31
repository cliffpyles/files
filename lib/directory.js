const fs = require('fs')
const pathModule = require('path')

class Directory {
  constructor(path) {
    this.path = path
  }

  static create(path) {
    const absolutePath = pathModule.resolve(path)

    return new Promise((resolve, reject) => {
      fs.mkdir(absolutePath, { recursive: true }, err => {
        if (err) {
          if (err.code === 'EEXIST') {
            resolve(new Directory(absolutePath))
          }
          reject(err)
        }

        resolve(new Directory(absolutePath))
      })
    })
  }

  static delete(path) {
    const absolutePath = pathModule.resolve(path)

    return new Promise((resolve, reject) => {
      fs.rmdir(absolutePath, err => {
        if (err) {
          reject(err)
        }

        resolve({ success: true })
      })
    })
  }

  static move(existingPath, newPath) {
    const absolutePath = pathModule.resolve(existingPath)
    const newAbsolutePath = pathModule.resolve(newPath)

    return new Promise((resolve, reject) => {
      fs.rename(absolutePath, newAbsolutePath, err => {
        if (err) {
          reject(err)
        }

        resolve(new Directory(newAbsolutePath))
      })
    })
  }

  static rename(existingPath, newPath) {
    return Directory.move(existingPath, newPath)
  }
}

module.exports = Directory

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
}

module.exports = Directory

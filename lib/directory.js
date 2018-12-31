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
}

module.exports = Directory

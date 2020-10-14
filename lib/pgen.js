const path = require('path')

const fu = require('@aestheticbookshelf/fileutils')

console.log("npm package generator - under development")
const packagesRoot = path.join(process.cwd(), "packages")
console.log("packages root", packagesRoot)

if(process.argv.length < 3){
    console.log("no package name provided")
    process.exit()
}

const packageName = process.argv[2]

console.log("create package", packageName)

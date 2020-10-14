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

const template = fu.readJson("pkg.template.json")

const global = template.global
const npmUser = global.npmUser
const email = global.email

const packageDir = path.join(packagesRoot, packageName)
const libDir = path.join(packageDir, "lib")

console.log("creating package directory", packageDir)

fu.createDir(packageDir)

const pkg = template.packages[packageName]
const repo = pkg.repo
const description = pkg.description || `Package ${packageName}.`

packageJson = {
  "name": `@${npmUser}/${packageName}`,
  "version": `${pkg.verson || "1.0.0"}`,
  "description": `${description}`,
  "main": `./lib/${packageName}.js`,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "bin": {    
  },
  "keywords": pkg.keywords || [ packageName ],
  "author": `${npmUser}`,
  "license": `${pkg.license || "MIT"}`,
  "homepage": `${repo}`,
  "bugs": {
    "url": `${repo}/issues`,
    "email": `${email}`
  },
  "repository": {
    "type": "git",
    "url": `${repo}.git`
  },
  "dependencies": {    
  },
  "devDependencies": {    
  }
}

packageJson.bin[`${packageName}`] = `./lib/${packageName}.js`

console.log("creating package.json")

fu.writeJson(path.join(packageDir, "package.json"), packageJson)

console.log("copying scripts")

fu.copyDir("s", path.join(packageDir, "s"))
fu.writeFile(path.join(packageDir, "bump.js"), fu.readFile("bump.js"))

console.log("copying license")

fu.writeFile(path.join(packageDir, "LICENSE"), fu.readFile("LICENSE"))

console.log("creating readme")

fu.writeFile(path.join(packageDir, "ReadMe.md"),`#${packageName}\n\n${description}`)

console.log("creating lib")

fu.createDir(libDir)

fu.writeFile(path.join(libDir, `${packageName}.js`), ``)
const path = require('path')

const fs = require("fs")

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

if(pkg.web){
    packageJson.scripts.build = "webpack --config webpack.config.js"
    packageJson.scripts.start = "webpack serve"
}

packageJson.bin[`${packageName}`] = `./lib/${packageName}.js`

console.log("creating package.json")

fu.writeJson(path.join(packageDir, "package.json"), packageJson)

console.log("copying scripts")

fu.copyDir("s", path.join(packageDir, "s"))
fu.copyDir("b", path.join(packageDir, "b"))

fs.copyFileSync("bump.js", path.join(packageDir, "bump.js"))

console.log("copying license")

fs.copyFileSync("LICENSE", path.join(packageDir, "LICENSE"))

console.log("creating readme")

fu.writeFile(path.join(packageDir, "ReadMe.md"), `#${packageName}\n\n${description}`)

console.log("creating .gitignore")

fu.writeFile(path.join(packageDir, ".gitignore"), `
node_modules
`)

console.log("creating lib")

fu.createDir(libDir)

fu.writeFile(path.join(libDir, `${packageName}.js`), ``)

console.log("writing config")

fu.writeFile(path.join(packageDir, "config"), `[core]
	repositoryformatversion = 0
	filemode = false
	bare = false
	logallrefupdates = true
	symlinks = false
	ignorecase = true
	hideDotFiles = dotGitOnly
[remote "github"]
	url = https://${npmUser}@github.com/${npmUser}/${packageName}.git
	fetch = +refs/heads/*:refs/remotes/github/*
[remote "gitlab"]
	url = https://${npmUser}@gitlab.com/${npmUser}/${packageName}.git
	fetch = +refs/heads/*:refs/remotes/gitlab/*
[user]
	name = ${npmUser}
	email = ${email}
	[credential "https://${npmUser}@github.com/${npmUser}/${packageName}.git"]
		username = ${npmUser}
	[credential "https://${npmUser}@gitlab.com/${npmUser}/${packageName}.git"]
		username = ${npmUser}
`)

if(pkg.web){
    console.log("adding web elements")

    console.log("writing webpack.config.js")

    fs.copyFileSync(path.join("web", "webpack.config.js"), path.join(packageDir, "webpack.config.js"))

    console.log("copying dist")

    fu.copyDir(path.join("web", "dist"), path.join(packageDir, "dist"))

    console.log("copying src")

    fu.copyDir(path.join("web", "src"), path.join(packageDir, "src"))

    fu.copyDir(path.join("web", "server"), path.join(packageDir, "server"))

    console.log("writing install")

    fs.copyFileSync(path.join("web", "install"), path.join(packageDir, "install"))
    fs.chmodSync(path.join(packageDir, "install"), '777')
    fs.copyFileSync(path.join("web", "startserver.sh"), path.join(packageDir, "startserver.sh"))
    fs.chmodSync(path.join(packageDir, "startserver.sh"), '777')
    fs.copyFileSync(path.join("web", "devserver.js"), path.join(packageDir, "devserver.js"))
    fs.copyFileSync(path.join("web", "Procfile"), path.join(packageDir, "Procfile"))
    fs.copyFileSync(path.join("web", "install.bat"), path.join(packageDir, "install.bat"))
}
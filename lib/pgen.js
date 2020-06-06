const path = require('path')

const fu = require('@aestheticbookshelf/fileutils')

console.log("npm package generator - under development")
const repoRoot = path.join(__dirname, "..")
console.log("dirname", __dirname, ", cwd", process.cwd(), ", root", repoRoot)
const pkgPath = path.join(process.cwd(), "pkg.json")

let pkgJson = fu.readFile(pkgPath, null)

if(pkgJson === null){
	console.log("no pkg.json detected, creating default")
	pkgJson = fu.readFile(path.join(repoRoot, "pkg.template.json"), null)
	if(pkgJson === null){
		console.log("fatal, missing pkg.template.json")
		process.exit()
	}else{
		fu.writeFile(pkgPath, pkgJson)
		console.log("done")
	}
	console.log("please edit and save pkg.json, then restart the program")
	process.exit()
}

let process

function spawnserver(){
    process = require('child_process').spawn("node", ["server/server.js", "dev"])

    process.stdout.on('data', (data) => {    
        console.error(`stdout: ${data}`)
    })

    process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`)
    })
}

spawnserver()

const watcher = require("chokidar").watch("./server")

watcher.on("ready", _=>{    
    watcher.on("all", _=>{      
        console.log("server reload")
        process.kill()
        spawnserver()
    })
})

const fs = require("fs");
const NdsNitroRom = require("./NdsNitroRom");
const NSARC = require("./Nsarc");
const KaitaiStream = require('kaitai-struct/KaitaiStream');
const { argv } = require("process");

const ROM_Name = __dirname + "/../DQIX.nds"

const fileContent = fs.readFileSync(ROM_Name);
const parsedNds = new NdsNitroRom(new KaitaiStream(fileContent));

/**Removes all the extra _values that create nested objects that are hard to print */
function raw(elem) {
    let r = {...elem}
    delete r._parent;
    delete r._io;
    delete r._root;
    for(let key in r) {
        if(typeof r[key] === 'object') {
            r[key] = raw(r[key]);
        }
    }
    return r
}

const NSARC_EXTENSIONS = ['nsarc', 'chr', 'ambl', 'ambj', 'mse']

/**@param {parsedNds} rom */
function extractFiles(rom, subdir="my_extract", fullExtract = false) {
    // Number the files from the table
    let index = rom.fnt.firstSubtableId;
    rom.fnt.subtables.forEach(sbt => {
        sbt.entries.forEach(ent => {
            if(ent.typeOrLen !== 0 && ent.typeOrLen >> 7 === 0) {
                ent.fileNum = index;
                index++
            }
        })
    })
    // Tells the recursive list of file directories
    let route = [`${__dirname}/${subdir}`];
    if(fs.existsSync(route[0])) {
        fs.rmSync(route[0], {recursive:true});
    }
    fs.mkdirSync(route[0]);

    makeFiles(rom.fnt.subtables[0].entries)

    function makeFiles(entries) {
        for(let i = 0; i < entries.length; i++) {
            let entry = entries[i];            
            // Skip ending files
            if(entry.typeOrLen === 0) break;
            if(entry.typeOrLen >> 7 === 1) {
                // Dir
                let dir = `${route.join("/")}/${entry.fileName}`
                console.log(dir);
                if(!fs.existsSync(dir)) {
                    fs.mkdirSync(`${route.join("/")}/${entry.fileName}`,);
                }
                route.push(entry.fileName);
                makeFiles(entry.subDir.entries)
            } else {
                // File
                let ext = entry.fileName.split(".")[1];
                if(fullExtract && ext !== undefined && NSARC_EXTENSIONS.includes(ext)) {
                    let nsarc = new NSARC(new KaitaiStream(rom.fat.entries[entry.fileNum].file));
                    console.log(`NSARC FILE: ${entry.fileName}`, raw(nsarc))
                } else {
                    let fileName = `${route.join("/")}/${entry.fileName}`;
                    // console.log(fileName, raw(rom.fat.entries[entry.fileNum]));
                    if(fs.existsSync(fileName)) {
                        fs.rmSync(fileName)
                    }
                    fs.writeFileSync(
                        `${route.join("/")}/${entry.fileName}`, 
                        rom.fat.entries[entry.fileNum].file
                    )
                }
            }
        }
        route.pop()
    }

    return rom;
}


/**@param {NdsNitroRom} rom */
function printFileList(rom, showNums = false){
    let fileIndex = rom.fnt.firstSubtableId;
    function printHelp(entries, indent) {
        for(let i = 0; i < entries.length; i++) {
            let entry = entries[i];
            // console.log(raw(entry))
            
            let line = ' '.repeat(indent);
            // Skip ending files
            if(entry.typeOrLen === 0) break;
            if(entry.typeOrLen >> 7 === 1) {
                // Dir
                console.log(`${showNums ? "    ":""}${line}${entry.fileName}/`);
                // console.log(raw(entry.subDir))
                printHelp(entry.subDir.entries, indent + 2);
            } else {
                // File
                console.log(`${showNums ? fileIndex.toString().padStart(4,' ') : ""}${line}${entry.fileName}`);
                fileIndex++;
            }
        }
    }
    printHelp(rom.fnt.subtables[0].entries, 0)   
}

function printExtensions(rom) {
    let extensions = {};
    rom.fnt.subtables.forEach(sbt => {
        sbt.entries.forEach(ent => {
            let ext = ent.fileName.split(".")[1]
            if(ext !== undefined) {
                if(extensions[ext] === undefined) {
                    extensions[ext] = 1
                } else {
                    extensions[ext]++;
                }
            }
        })
    })

    for(let ext in extensions) {
        console.log(`${extensions[ext].toString().padStart(4, ' ')}.${ext}`);
    }  
}

const cmd_args = [
    ["L",        "Lists files in the rom"],
    ["Lx",       "Lists unique file extensions in the rom"],
    ["X <dir>",  "Extracts the contents into the specified directory"],
    ["Xa <dir>", "Extracts the contents into the specified directory, including extracting all NSARC folders"],
]

function usage() {

    let maxFirstArgLen = cmd_args.reduce((acc, cv) =>acc < cv[0].length ? cv[0].length : acc, 0)
    console.log("Usage: node temp.js [options]\n");
    cmd_args.forEach(a => {
        console.log(`\t-${a[0].padEnd(maxFirstArgLen, " ")}\t${a[1]}`)
    })
}

// Remove node
argv.shift();
// Remove this file
argv.shift();

if(argv.length === 0) {
    usage()
    return;
} 

while(argv.length > 0) {
    switch(argv[0]) {
        case '-L': {
            printFileList(parsedNds);
            break;
        }
        case '-Lx': {
            printExtensions(parsedNds);
            break;
        }
        case '-X': {
            if(argv.length < 2) {
                console.log("-X requires specifying a directory to put extracted files into");
                return;
            }
            argv.shift();
            extractFiles(parsedNds, argv.shift());
            break;
        }
        case '-Xa': {
            if(argv.length < 2) {
                console.log("-Xa requires specifying a directory to put extracted files into");
                return;
            }
            argv.shift();
            extractFiles(parsedNds, argv.shift(), true);
            break;
        }
        default: {

            console.log("Invalid argument '"+argv[0]+"'")
            return;
        }
    }
    argv.shift();
}

// extractFiles(parsedNds);

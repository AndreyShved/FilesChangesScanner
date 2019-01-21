const fs = require("fs"); 
const rl = require("readline");
const crypto = require('crypto');

const HASHES_FILE = "hashes.data";

function GetHashOf(filePathArg) {
    var data = fs.readFileSync(filePathArg);
    var hash = crypto.createHash('sha256');
    hash.setEncoding('hex');
    hash.write(data.toString());
    hash.end();
    var sha1sum = hash.read();
    return sha1sum;
}

function GetHashesRec(dirpath,hashes) {
    var arrayOfFileNames = fs.readdirSync(dirpath);
    for (var i = 0 ; i < arrayOfFileNames.length; i++) {
        var fileName = arrayOfFileNames[i];
        try {
            if(fs.statSync(dirpath + "\\" + fileName).isDirectory()) {
                //console.log('"' + fileName + '" is directory!');
                GetHashesRec(dirpath + "\\" + fileName, hashes);
            } else {
                var fileFullPath = dirpath + "\\" + fileName;
                var hash = GetHashOf(fileFullPath);
                fileHashes[fileFullPath] = hash;
                //console.log(fileName + ': ' + hash);
            }
        } catch (e) {
            console.log(e.message);
        }
    }
}

function ReadHashesFromFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function CompareHashes(oldHashes,newHashes) {
    for (var property in newHashes) {
        if (newHashes.hasOwnProperty(property)) {
            if(typeof oldHashes[property] !== 'undefined') {
                if(oldHashes[property]!=newHashes[property]) {
                    console.log(' File has been CHANGED: ' + property);
                }
            } else {
                console.log(' New file DISCOVERED: ' + property);
            }
        }
    }
    for (var property in oldHashes) {
        if (oldHashes.hasOwnProperty(property)) {
            if(typeof newHashes[property] === 'undefined') {
                console.log(' File has been DELETED: ' + property);
            }
        }
    }
}

function GetHashForSpecificDir(hashesObj,dirpath) {
    var scpecificHashes = {};
    for (var property in hashesObj) {
        if (hashesObj.hasOwnProperty(property)) {
            if(property.indexOf(dirpath) !== -1) {
                scpecificHashes[property] = hashesObj[property];
            }
        }
    }
    return scpecificHashes;
}

function UpdateHashes(oldHashes,newHashes,allHashes) {
    for (var property in newHashes) {
        if (newHashes.hasOwnProperty(property)) {
            allHashes[property] = newHashes[property];
        }
    }
    for (var property in oldHashes) {
        if (oldHashes.hasOwnProperty(property)) {
            if(typeof newHashes[property] === 'undefined') {
                delete allHashes[property]; // File has been deleted
            }
        }
    }

    return allHashes;
}

var savedFileHashes = {};
var fileHashes = {};


var stdIO = rl.createInterface(process.stdin, process.stdout); 
stdIO.question("Enter directory path: ", function(dirpath) {
    savedFileHashes = ReadHashesFromFile(HASHES_FILE);
    
    GetHashesRec(dirpath, fileHashes);

    var oldHashes = GetHashForSpecificDir(savedFileHashes,dirpath);
    var newHashes = fileHashes;

    CompareHashes(oldHashes,newHashes);

    fileHashes = UpdateHashes(oldHashes,newHashes,savedFileHashes);

    fs.writeFile(HASHES_FILE, JSON.stringify(fileHashes), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("Scan results has been saved!");
    }); 

    stdIO.close();
});


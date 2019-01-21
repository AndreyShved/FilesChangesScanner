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
                console.log('"' + fileName + '" is directory!');
                GetHashesRec(dirpath + "\\" + fileName, hashes);
            } else {
                var fileFullPath = dirpath + "\\" + fileName;
                var hash = GetHashOf(fileFullPath);
                fileHashes[fileFullPath] = hash;
                console.log(fileName + ': ' + hash);
            }
        } catch (e) {
            console.log(e.message);
        }
    }
}

function ReadHashesFromFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

var savedFileHashes = {};
var fileHashes = {};


var stdIO = rl.createInterface(process.stdin, process.stdout); 
stdIO.question("Enter directory path: ", function(dirpath) {
    savedFileHashes = ReadHashesFromFile(HASHES_FILE);
    console.log(savedFileHashes);
    GetHashesRec(dirpath, fileHashes);
    console.log(fileHashes);

    fs.writeFile(HASHES_FILE, JSON.stringify(fileHashes), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 

    stdIO.close();
});


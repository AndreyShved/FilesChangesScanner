var fs = require("fs"); 
var rl = require("readline");
var crypto = require('crypto');

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

var fileHashes = {};

var stdIO = rl.createInterface(process.stdin, process.stdout); 
stdIO.question("Enter directory path: ", function(dirpath) {
    GetHashesRec(dirpath, fileHashes);
    console.log(fileHashes);

    fs.writeFile("hashes.data", JSON.stringify(fileHashes), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 

    stdIO.close();
});


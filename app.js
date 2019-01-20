// var msg = 'Hello World';
// var http = require('http');
// var readlineI = require('readlineI');

// console.log('This example is different!');
// console.log('The result is displayed in the Command Line Interface');

// var stdin = process.openStdin();

// stdin.addListener("data", function(d) {
//     // note:  d is an object, and when converted to a string it will
//     // end with a linefeed.  so we (rather crudely) account for that  
//     // with toString() and then trim() 
//     console.log("you entered: [" + 
//         d.toString().trim() + "]");
//   });

// console.log(msg);

// var fs = require("fs"); 

// fs.readFile('C:\\Users\\Андрій\\Documents\\WORKSPACES\\nodejsExample\\1.txt', function(err, data) {
//     console.log(data.toString());  
//   });

// var rl = require("readline");  
// var prompts = rl.createInterface(process.stdin, process.stdout);  
// prompts.question("Enter Your Name? ", function(username) {  
//     prompts.question("Enter Your Age ? ", function(userage) {  
//         prompts.question("Enter Your Email ID? ", function(emailid) {  
//             prompts.question("Enter Your Mobile No.? ", function(mobile) {  
//                 var message = "";  
//                 if (userage > 18) {  
//                     message = "\n\n Great! " + username + "\n\n You can signin." + "\n\n User Name : " + username + "\n\n Age       : " + userage + "\n\n Email ID  : " + emailid + "\n\n Mobile    : " + mobile;  
//                 } else {  
//                     message = "Minimum required 18 years and you age is " + userage + " , You should wait at least " + (18 - userage) + " year(s) more.";  
//                 }  
//                 fs.readFile('C:\\Users\\Андрій\\Documents\\WORKSPACES\\nodejsExample\\1.txt', function(err, data) {
//                     console.log(data);  
//                   });
//                 console.log(message); 
//                 prompts.close();   
//             });  
//         });  
//     });  
// }); 

var fs = require("fs"); 
var rl = require("readline");
var crypto = require('crypto');

function GetHashOf(filePathArg) {
    var data = fs.readFileSync(filePathArg);
    var hash = crypto.createHash('sha1');
    hash.setEncoding('binary');
    hash.write(data.toString());
    hash.end();
    var sha1sum = hash.read();
    return sha1sum;
}

var stdIO = rl.createInterface(process.stdin, process.stdout); 
stdIO.question("Enter directory path: ", function(dirpath) {
    var arrayOfFileNames = fs.readdirSync(dirpath);
    for (var i = 0 ; i < arrayOfFileNames.length; i++) {
        var fileName = arrayOfFileNames[i];
        try {
            if(fs.statSync(dirpath + "\\" + fileName).isDirectory()) {
                console.log('"' + fileName + '" is directory!');
            } else {
                var hash = GetHashOf(dirpath + "\\" + fileName);
                console.log(fileName+ ': '+hash);
            }
        } catch (e) {
            console.log(e.message);
        }
    }
    stdIO.close();
});
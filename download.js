//Download a page and save to disk

var http = require('http');
var fs = require('fs');
var zlib = require('zlib');

// url is the location of file to download
// fileName is full path of destination
var downloadPage = function(url) {

    // var url = "http://c758482.r82.cf2.rackcdn.com/sublime-text_build-3059_amd64.deb";
    var name = url.split('/');
    var fileName = name[name.length - 1];
    console.log(fileName);

    http.get(url, function(response) {
        if (response.statusCode !== 200) {
            if (response) {
                console.log(response.statusCode + ' ERROR getting ' + url);
            }
            process.exit(1);
        }
        var fd = fs.openSync(fileName, 'w');
        response.on("data", function(chunk) {
            fs.write(fd, chunk, 0, chunk.length, null, function(err, written, buffer) {
                if (err) {
                    console.log(err);
                    process.exit(1);
                }
            });
        });

        response.on("end", function() {
            fs.closeSync(fd);
            // process.exit(0);
            zipfile(fileName);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
        process.exit(1);
    });
};

var zipfile = function(fileName) {
    var gzip = zlib.createGzip();
    var fs = require('fs');
    var inp = fs.createReadStream(fileName);
    var out = fs.createWriteStream(Date.now() + '.gz');
    console.log("zipando...");
    inp.pipe(gzip).pipe(out);
    console.log("ZIP completo");

    var fs = require('fs');
    var tempFile = fs.openSync(fileName, 'r');
    fs.closeSync(tempFile);
    fs.unlinkSync(filename);
}

downloadPage("http://c758482.r82.cf2.rackcdn.com/sublime-text_build-3059_amd64.deb");

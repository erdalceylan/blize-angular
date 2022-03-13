/**
 * Mantık angular da sayfa yenilenmediği için eğer yeni bir deploy yapılmışsa
 * angular tarafında sayfayı yenilemesini sağlıyoruz
 */
var exec = require('child_process').exec;
var crypto = require('crypto');
var fs = require('fs');

var ROOT_PROJECT = '../blize-php';
var ROOT_PROJECT_DIST = ROOT_PROJECT + '/public/dist/';
var ROOT_FILE_ENV =  ROOT_PROJECT + '/.env';
var ROOT_PROJECT_INDEX = ROOT_PROJECT + '/templates/dashboard/index.html.twig';

var dir = exec("npm run-script build", {maxBuffer: 1024 * 1024 * 500}, function (err, stdout, stderr) {

  if (stdout) {

    //senkron edilecek css ve js dosyalarını al
    var regex = /[a-z0-9]{1,20}\.[a-z0-9]{20}\.(js|css)/gi;
    var matchesElement = stdout.match(regex);

    matchesElement.forEach(function (item, index) {
      matchesElement[index] = item.replace(/^32m/, '');
    });

    //senkron edilecek css ve js dosyalarının hash ını al
    var md5Hex = crypto.createHash('md5').update(matchesElement.toString()).digest("hex");

    //angular konsol çıktısı ve hash
    console.log(stdout);
    console.log('angular file hash : '+ '\x1b[41m' + md5Hex ,'\x1b[0m');

    //.env içine ANGULAR_HASH değişkenini yazdır
    var envFile = fs.readFileSync(ROOT_FILE_ENV, 'utf8');
    var hashLine = envFile.match(/(^|\n)ANGULAR_HASH(\s+|)=.*/)[0];
    fs.writeFileSync("./dist/ANGULAR_HASH.txt", md5Hex);

    fs.writeFileSync(
      ROOT_FILE_ENV,
      envFile.replace(hashLine, "\nANGULAR_HASH="+md5Hex),
      'utf8');

    //index.html içine ANGULAR_HASH değerini yazdır ve .twig dosyasına yaz
    var indexHtml = fs.readFileSync('./dist/index.html', 'utf8');
    indexHtml = indexHtml.replace('{{ANGULAR_HASH}}', md5Hex);
    fs.writeFileSync(ROOT_PROJECT_INDEX, indexHtml, 'utf8');

    //dist klasörünü projedeki dist klasörüne senkron et
    exec('rsync --delete --archive --verbose ./dist/ ' + ROOT_PROJECT_DIST,
      {maxBuffer: 1024 * 1024 * 500},
      function (err, stdout, stderr)
      {
        console.log(err);
        console.log(stdout);
        console.log(stderr);
      });

  }

  // HATA VARSA EKSRANA BAS
  if (err) {
    console.log(err);
  }

  if (stderr) {
    console.log(stderr);
  }
});

dir.on('exit', function (code) {
  // exit code is code
  console.log(code);
});

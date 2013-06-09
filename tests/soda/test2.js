var soda = require('soda')
  , assert = require('assert');

var browser = soda.createClient({
    host: 'localhost'
  , port: 4444
  , url: 'file:///home/dan/Desktop/sandbox/richie/test.html'
  , browser: 'firefox'
});

browser
  .chain
  .session()
  .open('/')
  .waitForPageToLoad(5000)
  .end(function(err){
    browser.testComplete(function() {
      console.log('done');
      if(err) throw err;
    });
  });

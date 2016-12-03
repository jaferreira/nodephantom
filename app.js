var Horseman = require('node-horseman');
var horseman = new Horseman();

horseman
  .open('http://www.abola.pt')

  .count("li")
  .then(function(numLinks){
	console.log("Number of links: " +numLinks);
	horseman.close();
  });
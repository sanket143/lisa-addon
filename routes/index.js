var express = require('express');
var router = express.Router();
var fs = require('fs')
var Fuse = require('fuse.js')

var fuse;

fs.readFile('data/mp3data.json', (err, item) => {
  if (err) throw err
  json = JSON.parse(item.toString())
  options = {
    threshold: 0.8,
    minMatchCharLength: 4,
    includeScore: true,    
    keys: [{
      name: 'title',
      weight: 0.4
    },
    {
      name: 'artist',
      weight: 0.4
    },
    {
      name: 'album',
      weight: 0.2
    }],
  }

  fuse = new Fuse(json, options)
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/results', function(req, res) {
  search_result = fuse.search(req.query.q)
  search_result = search_result.filter((a, b) => {

    return parseInt(a.score * 10) == 0
  })
  
  render_result = []
  for(i = 0; i < search_result.length; i++){
    console.log(search_result[i])
    obj = {
      "title": search_result[i].item["artist"] + " - " + search_result[i].item["title"],
      "url": search_result[i].item["src"],
      "content": ""
    }

    console.log(obj)
    render_result.push(obj)
  }
  
  res.render("search", {
    data: render_result
  })
})

module.exports = router;
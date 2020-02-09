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

fs.readFile('data/indexed_document.json', (err, item) => {
  if(err) throw err
  _json = JSON.parse(item.toString())
  options = {

    threshold: 0.8,
    minMatchCharLength: 4,
    includeScore: true,    
    keys: [{
      name: 'src',
      weight: 0.4
    },
    {
      name: 'content',
      weight: 0.4
    }],
  }
})

/* GET home page. */
router.get('/search', function(req, res, next) {
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
  res.json(render_result)
});

module.exports = router;

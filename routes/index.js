var express = require('express');
var router = express.Router();
var fs = require('fs')
var Fuse = require('fuse.js')
var path = require('path')

var fuse;
var arr = [];

item = fs.readFileSync('data/mp3data.json').toString('utf8')
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

for(i in json){
  obj = {
    "title": json[i]["artist"] + " - " + json[i]["title"],
    "url": json[i]["src"],
    "content": ""
  }
}

arr = arr.concat(json)

item = fs.readFileSync('data/indexed_document.json').toString('utf8')
_json = JSON.parse(item.toString())
options = {
  threshold: 0.8,
  minMatchCharLength: 4,
  includeScore: true,    
  keys: [{
    name: 'title',
    weight: 0.6
  },
  {
    name: 'url',
    weight: 0.1
  },
  {
    name: 'content',
    weight: 0.4
  }],
}

for(i in _json){
  obj = {
    "title": path.basename(_json[i]["src"]),
    "url": _json[i]["src"],
    "content": _json[i]["content"].slice(0, 100) + "..."
  }
  
  arr.push(obj)
}

fuse = new Fuse(arr, options)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/results', function(req, res) {
  search_result = fuse.search(req.query.q).slice(0, 5)

  search_result = search_result.filter((a, b) => {
    if(a.item["src"]){
      console.log(a.item["src"], a.score)
      return parseInt(a.score * 10) == 0
    }
    if(a.item["url"]){
      return a.score < 0.3
    }
    return false
  })

  render_result = []
  for(i = 0; i < search_result.length; i++){
    if(search_result[i].item["src"]){
      obj = {
        "title": search_result[i].item["artist"] + " - " + search_result[i].item["title"],
        "url": search_result[i].item["src"],
        "content": ""
      }
    } else {
      obj = {
        "title": path.basename(search_result[i].item["url"]),
        "url": search_result[i].item["url"],
        "content": search_result[i].item["content"]
      }
    }
    render_result.push(obj)
  }
  
  res.render("search", {
    data: render_result
  })
})

module.exports = router;
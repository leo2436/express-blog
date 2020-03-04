var sendHtml = function(path, response) {
  var fs = require('fs')
  var options = {
      encoding: 'utf-8'
  }
  path = 'template/' + path
  fs.readFile(path, options, function(err, data){
      response.send(data)
  })
}

var detail = {
  path: '/blog',
  method: 'get',
  func: function(request, response) {
      var path = 'blog_detail.html'
      sendHtml(path, response)
  }
}

var routes = [
  detail,
]

module.exports.routes = routes
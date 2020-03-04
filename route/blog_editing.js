const blog = require('../model/blog')


var all = {
    path: '/api/blog/all',
    method: 'get',
    func: function(request, response) {
        var blogs = blog.all()
        var r = JSON.stringify(blogs)
        response.send(r)
    }
}

var add = {
    path: '/api/blog/add',
    method: 'post',
    func: function(request, response) {
        var form = request.body
        // 插入新数据并返回
        // 验证密码
        // if(form.mima == '123') {
        //     console.log('yes')
        //     var b = blog.new(form)
        //     var r = JSON.stringify(b)
        // } else {
        //     var r = JSON.stringify({
                
        //     })
        // }
        var b = blog.new(form)
        var r = JSON.stringify(b)
        response.send(r)
    }
}

var dele = {
    path: '/api/blog/dele',
    method: 'post',
    func: function(request, response) {
        var deletedId = request.body.deletedId
        blog.delete(deletedId)
        var blogs = blog.all()
        var r = JSON.stringify(blogs)
        response.send(r)
    }
}

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
  
var editor = {
path: '/editor',
method: 'get',
func: function(request, response) {
    var path = 'blog_editing.html'
    sendHtml(path, response)
 }
}



var routes = [
    all,
    add,
    dele,
    editor,
]

module.exports.routes = routes

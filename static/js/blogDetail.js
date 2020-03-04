var ajax = function (request) {
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function (event) {
        if (r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

var e = function (selector) {
    return document.querySelector(selector)
}

var detailTemplate = function (blog) {
    var id = blog.id
    var title = blog.title
    var author = blog.author
    var content = blog.content
    var d = new Date(blog.created_time * 1000)
    var time = d.toLocaleString().split('/')
    var year = time[0]
    var month = time[1]
    var day = time[2].split(' ')[0]
    var t = `
  <div class="blog-cell">
      <h1>${title}</h1>
        <p><span class="glyphicon glyphicon-user"></span> ${author}</p>
        <p><span class="glyphicon glyphicon-time"></span> ${year}年${month}月${day}日</p>
      <div>${content}</div>
  </div>
  `
    return t
}


var insertBlogAll = function (blogs, id) {
    var html = ''
    for (let i = 0; i < blogs.length; i++) {
        const blog = blogs[i];
        if (blog.id == id) {
            var b = blogs[i]
            var t = detailTemplate(b)
        }
    }
    html += t

    // 把数据写入 blogs 中, 直接用覆盖式写入
    var div = document.querySelector('.blog')
    div.innerHTML = html
}

var blogAll = function () {
    var request = {
        method: 'GET',
        url: '/api/blog/all',
        contentType: 'application/json',
        callback: function (response) {
            var blogs = JSON.parse(response)
            window.blogs = blogs
            var body = document.querySelector('body')
            var blogId = body.baseURI.split('=')[1]
            //   console.log('blogId', blogId)
            insertBlogAll(blogs, blogId)
        }
    }
    ajax(request)
}

//comment部分
var bindCommentButton = function () {
    var submit = e('.comment-submit')
    submit.addEventListener('click', function (event) {
        var author = e('.comment-author')
        var name = author.value
        var content = e('.comment-input').value
        console.log('test', content)
        var blogId = e('body').baseURI.split('=')[1]
        var form = {
            author: name,
            input: content,
            blog_id: blogId
        }
        for (var i in form) {
            if (form[i].length == 0) {
                e('.comment-' + `${i}`).placeholder = '此处不能为空！'
                return
            }
        }
        // console.log('form', form)
        commentNew(form)
        commentAll()
    })
}

//载入页面comment
var insertCommentAll = function (comments) {
    // console.log('com', comments)
    var html = ''
    for (let i = 0; i < comments.length; i++) {
        var comment = comments[i]
        var blogId = e('body').baseURI.split('=')[1]
        if (comment.blog_id == blogId) {
            var b = comment
            var t = commentTemplate(b)
            html += t
        }
    }
    // 把数据写入 blogs 中, 直接用覆盖式写入
    var div = document.querySelector('.sub-comments')
    div.innerHTML = html
}


var commentTemplate = function (comment) {
    var name = comment.author
    var content = comment.content
    // console.log('com', comment)
    var d = new Date(comment.created_time * 1000)
    var time = d.toLocaleString().split('/')
    var year = time[0]
    var month = time[1]
    var day = time[2].split(' ')[0]
    var t = `
        <div class="comment-content">
            <div class="comment-header">
                <h4 font-style="normal">${name}说:</h4>
            </div>
            <div id="id-span-content">
                <span>${content}</span>
            </div>
            <div id="id-span-time">
                <span>${year}年${month}月${day}日</span>
            </div>  
        </div>  
    `
    return t
}

var commentAll = function () {
    var request = {
        method: 'GET',
        url: '/api/comment/all',
        contentType: 'application/json',
        callback: function (response) {
            // 不考虑错误情况(断网/服务器返回错误等等)
            var comments = JSON.parse(response)
            // console.log('comments', comments)
            insertCommentAll(comments)
        }
    }
    ajax(request)
}

var commentNew = function (form) {
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/comment/add',
        data: data,
        contentType: 'application/json',
        callback: function (response) {
            // console.log('new响应', response)
        }
    }
    ajax(request)
}


var main = function () {
    blogAll()
    commentAll()
    bindCommentButton()
}
main()
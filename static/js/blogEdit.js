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

var e = (sel) => document.querySelector(sel)

var blogTemplate = function (blog) {
    var id = blog.id
    var title = blog.title
    var author = blog.author
    var d = new Date(blog.created_time * 1000)
    var time = d.toLocaleString()
    var t = `
    <div class="blog-cell container">
        <div class="">
            <a class="blog-title" href="blog?id=${id}" data-id="${id}">
                ${title}
            </a>
        </div>
        <div class="">
            <span>作者：${author}</span>  <time>发布时间：${time}</time>
        </div>
        <button class="delete btn btn-warning">删除</button>
    </div>
    `
    return t
}

var insertBlogAll = function (blogs) {
    var html = ''
    for (var i = blogs.length - 1; i >= 0; i--) {
        var b = blogs[i]
        var t = blogTemplate(b)
        html += t
    }
    // 把数据写入 .blogs 中, 直接用覆盖式写入
    var div = e('.blogs')
    div.innerHTML = html
}

var insertBlog = function (blog) {
    var blogContainer = e('.blogs')
    var t = blogTemplate(blog)
    // 把数据写入 .blogs 中, 直接用覆盖式写入
    blogContainer.insertAdjacentHTML('afterbegin', t)
}

var blogAll = function () {
    var request = {
        method: 'GET',
        url: '/api/blog/all',
        contentType: 'application/json',
        callback: function (response) {
            // 不考虑错误情况(断网/服务器返回错误等等)
            var blogs = JSON.parse(response)
            // console.log('blogs,', blogs)
            insertBlogAll(blogs)
        }
    }
    ajax(request)
}

var blogNew = function (form) {
    // var form = {
    //     title: "测试标题",
    //     author: "gua",
    //     content: "测试内容",
    // }
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/blog/add',
        data: data,
        contentType: 'application/json',
        callback: function (response) {
            // console.log('new响应', response)
            var blog = JSON.parse(response)
            insertBlog(blog)
        }
    }
    ajax(request)
}

var blogDelete = function (id) {
    var blog = {}
    blog.deletedId = id
    var data = JSON.stringify(blog)
    var request = {
        method: 'POST',
        url: '/api/blog/dele',
        data: data,
        contentType: 'application/json',
        callback: function (response) {
            // console.log('delete响应', response)
            var blogs = JSON.parse(response)
            insertBlogAll(blogs)
        }
    }
    ajax(request)
}

var e = function (selector) {
    return document.querySelector(selector)
}

var bindEvents = function () {
    // 绑定发表新博客事件
    var button = e('#id-button-submit')
    button.addEventListener('click', function (event) {
        // 得到用户填写的数据
        var form = {
            title: e('#id-input-title').value,
            author: e('#id-input-author').value,
            content: e('#id-content-preview').innerHTML,
        }
        for (var i in form) {
            if (form[i].length == 0) {
                e('#id-input-' + `${i}`).placeholder = '此处不能为空！'
                return
            }
        }
        // 用这个数据调用 blogNew 来创建一篇新博客
        blogNew(form)
    })
}

var bindDelete = function () {
    var blogs = e('.blogs')
    blogs.addEventListener('click', function (event) {
        if (event.target.className.includes('delete')) {
            var blog = event.target.parentElement
            var blogTitle = blog.querySelector('a')
            var blogId = blogTitle.href.split('=')[1]
            blogDelete(blogId)
            console.log('send')
            blogs.removeChild(blog)
        }
    })
}

var mdEditing = function () {
    e('#id-input-content').addEventListener('keyup', (event) => {
        var mdValue = event.target.value;
        var converter = new showdown.Converter();
        var html = converter.makeHtml(mdValue);
        e("#id-content-preview").innerHTML = html;
    })
}


var __main = function () {
    // 载入博客列表
    blogAll()
    // 绑定事件
    bindEvents()
    bindDelete()
    mdEditing()
}

__main()

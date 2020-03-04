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

var indexPage = function () {
    var request = {
        method: 'GET',
        url: '/',
        contentType: 'application/json',
        callback: function (response) {
        }
    }
    ajax(request)
}

var blogAll = function () {
    var request = {
        method: 'GET',
        url: '/api/blog/all',
        contentType: 'application/json',
        callback: function (response) {
            // 不考虑错误情况(断网/服务器返回错误等等)
            var blogs = JSON.parse(response)
            //   console.log('blogs,', blogs)
            insertBlogAll(blogs)
        }
    }
    ajax(request)
}

var insertBlogAll = function (blogs) {
    var html = ''
    for (var i = blogs.length - 1; i >= 0; i--) {
        var b = blogs[i]
        var t = blogTemplate(b)
        html += t
    }
    // 把数据写入 .blogs 中, 直接用覆盖式写入
    var div = document.querySelector('.col-sm-8')
    div.innerHTML = html
}

var blogTemplate = function (blog) {
    var id = blog.id
    var title = blog.title
    var author = blog.author
    var content = blog.content
    var imgSrc = 'images/ap.png'
    var d = new Date(blog.created_time * 1000)
    var time = d.toLocaleString().split('/')
    var year = time[0]
    var month = time[1]
    var day = time[2].split(' ')[0]
    if (content.includes('\n')) {
        var contents = content
        content = content.split('\n')[1]
        var img = contents.split('\n')[0]
        imgSrc = img.split('"')[1]
        if (content.length > 140) {
            content = content.slice(0, 140)
        }
    }
    //   console.log(content)
    var t = `
    <div class="blog-cell container">
        <div class="article-info">
            <h2>
                <a class="blog-title" href="blog?id=${id}">
                ${title}
                </a>
            </h2>
            <h4><span class="glyphicon glyphicon-user"></span> ${author}</h5>
            <p><span class="glyphicon glyphicon-time"></span> ${year}年${month}月${day}日</p>
        </div>
        <div class="article-detail">
            <div class="blog-content">
                <div class="blog-abstract">${content}</div>
                <a href="blog?id=${id}"><button class="btn-default btn-lg">阅读全文</button></a>
            </div>
            <div class="img">
                <img class="img-thumbnail" src="${imgSrc}">
            </div>
        </div>
    </div>
  `
    return t
}

var addActive = function () {
    var nav = e('.navbar-nav')
    nav.addEventListener('click', function () {
        var cells = nav.querySelectorAll('li')
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            event.target.className = 'active'
        }
    })
}

var main = function () {
    blogAll()
    indexPage()
    addActive()
}

main()
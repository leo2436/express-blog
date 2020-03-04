var fs = require('fs')


var filePath = 'db/comment.json'


// 这是一个用来存储 comment 数据的对象
const ModelComment = function (form) {
    this.author = form.author || ''
    this.content = form.input || ''
    this.blog_id = form.blog_id || 0
    this.created_time = Math.floor(new Date() / 1000)
}

const loadData = function () {
    // 确保文件有内容, 这里就不用处理文件不存在或者内容错误的情况了
    var content = fs.readFileSync(filePath, 'utf8')
    if (content.length == 0) {
        var data = []
        return data
    } else {
        var data = JSON.parse(content)
        return data
    }
}


var b = {
    data: loadData()
}

b.all = function () {
    return this.data
}

b.new = function (form) {
    var m = new ModelComment(form)
    console.log('m', m)
    // 设置新数据的 id
    var d = this.data[this.data.length - 1]
    if (d == undefined) {
        m.id = 1
    } else {
        m.id = d.id + 1
    }
    // 把 数据 加入 this.data 数组
    this.data.push(m)
    // 把 最新数据 保存到文件中
    this.save()
    // 返回新建的数据
    return m
}

b.save = function () {
    var s = JSON.stringify(this.data)
    fs.writeFile(filePath, s, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('保存成功')
        }
    })
}

// 导出一个对象的时候用 module.exports = 对象 的方式
module.exports = b

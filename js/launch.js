{
    // 配置对象
    const config = {
        get(text) {
            const newConfig = JSON.parse(text);
            for (const i in newConfig) {
                config[i] = newConfig[i];
            }
            page.get();
            image.check();
            btn.check();
            page.check();
            image.set();
        }
    };
    // 页面对象
    const page = {
        size: 0,
        num: 0,
        now: 0,
        code: 0,
        get() {
            page.size = config.pageSize;
            page.num = Math.ceil(image.list.length / page.size);
        },
        check() {
            page.get();
            if (page.now >= page.num) {
                page.now = page.num - 1;
                if (page.now < 0) {
                    page.now = 0;
                }
            }
            if (page.code + page.now * page.size >= image.list.length) {
                page.code = image.list.length % page.size - 1;
                if (page.code < 0) {
                    page.code = 0;
                }
            }
        }
    };
    // 图片对象
    const image = {
        list: [],
        element: [],
        get(text) {
            const text_split = text.split('\n');
            for (let i = 0; i < image.list.length; i++) {
                if (!text_split.includes(image.list[i])) {
                    image.list.splice(i, 1);
                    i--;
                }
            }
            for (const i in text_split) {
                if (!image.list.includes(text_split[i])) {
                    image.list.push(text_split[i]);
                }
            }
            image.list.pop();
            ajax.get('ui-config.json', config.get);
        },
        create() {
            for (let i = image.element.length; i < page.size; i++) {
                const newImage = document.createElement('div');
                newImage.className = 'imageBtn';
                const img = document.createElement('img');
                newImage.addEventListener('click', () => {
                    page.code = i;
                    mainImage.src = img.src;
                    textBox.innerHTML = `第${page.code + 1 + page.now * page.size}张`;
                });
                newImage.setSrc = (src) => {
                    img.src = src;
                };
                newImage.appendChild(img);
                image.element.push(newImage);
            }
        },
        delete() {
            for (let i = image.element.length; i > page.size; i--) {
                const needDeleteImage = image.element.splice(image.element.length - 1, 1)[0];
                if (imageBox.contains(needDeleteImage)) {
                    imageBox.removeChild(needDeleteImage);
                }
            }
        },
        check() {
            image.create();
            image.delete();
        },
        set(pageCode = 0) {
            for (let i = 0; i < page.size; i++) {
                const code = i + page.now * page.size;
                if (i == pageCode) {
                    page.code = pageCode;
                    if (image.list.length) {
                        mainImage.src = image.list[code];
                        textBox.innerHTML = `第${page.code + 1 + page.now * page.size}张`;
                    } else {
                        mainImage.src = '';
                        textBox.innerHTML = '';
                    }
                    btn.setStyle();
                }
                if (code < image.list.length) {
                    image.element[i].setSrc(image.list[code]);
                    if (!imageBox.contains(image.element[i])) {
                        imageBox.appendChild(image.element[i]);
                    }
                } else {
                    if (imageBox.contains(image.element[i])) {
                        imageBox.removeChild(image.element[i]);
                    }
                }
            }
        }
    }
    // 按钮对象
    const btn = {
        element: [],
        create() {
            for (let i = btn.element.length; i < page.num; i++) {
                const newBtn = document.createElement('div');
                newBtn.className = 'btn';
                newBtn.innerHTML = i + 1;
                newBtn.addEventListener('click', () => {
                    page.now = i;
                    image.set();
                });
                if (i == page.now) {
                    newBtn.style.background = '#DDEEFF';
                    newBtn.style.color = '#001122';
                }
                btnBox.appendChild(newBtn);
                btn.element.push(newBtn);
            }
        },
        delete() {
            for (let i = btn.element.length; i > page.num; i--) {
                const needDeleteBtn = btn.element.splice(btn.element.length - 1, 1)[0];
                btnBox.removeChild(needDeleteBtn);
            }
        },
        check() {
            btn.create();
            btn.delete();
        },
        setStyle() {
            for (const i in btn.element) {
                if (i == page.now) {
                    btn.element[i].style.background = '#DDEEFF';
                    btn.element[i].style.color = '#001122';
                } else {
                    btn.element[i].style.background = '#001122';
                    btn.element[i].style.color = '#DDEEFF';
                }
            }
        }
    }


    // 获取元素
    const $ = (selectors, index = -1) => {
        const element = document.querySelectorAll(selectors);
        if (index < 0 && !(index = 0) && element.length > 1) {
            return element;
        }
        return element[index];
    };


    // 发送Ajax请求
    const ajax = {
        init(xhr, callback) {
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    callback(xhr.responseText);
                }
            };
            return xhr;
        },
        get(path, callback, args = null) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', path + ['', '?' + args][+!!args]);
            this.init(xhr, callback);
            xhr.send();
        },
        post(path, callback, args = null) {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', path);
            this.init(xhr, callback);
            xhr.send(args);
        }
    };


    // 全屏按钮
    const fullScreenBtn = $('#fullScreenBtn');
    // 文本容器
    const textBox = $('#textBox');
    // 刷新按钮
    const refreshBtn = $('#refreshBtn');
    // 下载按钮
    const downloadBtn = $('#downloadBtn');
    // 删除按钮
    const deleteBtn = $('#deleteBtn');
    // 主要图片
    const mainImage = $('#mainImage');
    // 图片容器
    const imageBox = $('#imageBox');
    // 按钮容器
    const btnBox = $('#btnBox');


    // 点击全屏
    fullScreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            $('html').requestFullscreen();
            fullScreenBtn.style.display = 'none';
        }
    });


    // 非全屏时显示全屏按钮
    window.addEventListener('resize', () => {
        if (!document.fullscreenElement) {
            fullScreenBtn.style.display = 'block';
        } else {
            fullScreenBtn.style.display = 'none';
        }
    });


    // 点击刷新
    refreshBtn.addEventListener('click', () => {
        ajax.post('getImage', image.get);
    });


    // 点击下载
    downloadBtn.addEventListener('click', () => {
        const a  = document.createElement('a');
        a.href = mainImage.src;
        src_split = mainImage.src.split('/');
        a.download = 'PictureView-' + src_split[src_split.length - 1];
        a.click();
    });


    // 点击删除
    deleteBtn.addEventListener('click', () => {
        let tips = document.querySelector('#tips');
        if (!tips) {
            tips = document.createElement('div');
            tips.id = 'tips';
            Object.assign(tips.style, {
                position: 'absolute',
                display: 'none',
                top: '35vh',
                left: '35vw',
                width: '30vw',
                height: '30vh',
                background: '#223344'
            });
            document.body.appendChild(tips);
        };
        tips.style.display = 'block';
    });


    ajax.post('getImage', image.get);
}

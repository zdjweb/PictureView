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
            config.get(`{
                "pageSize": 5
            }
            `);
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


    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        alert('该网页展示的图片禁止下载');
    });
    fullScreenBtn.style.display = 'none';


    // 点击刷新
    refreshBtn.addEventListener('click', () => {
        image.get(`./image/0655c2a84be9269d8d76c77df7f5d08900e52c7d.jpg
        ./image/0cc250aaf8b7de81a762b346cddd23b52dc69f2c.jpg
        ./image/19f7b905e0e2394df866f4dc146d20c20a891ebc.jpg
        ./image/23aa3d56b6a30f8a20d5893e609696fd96beb386.jpg
        ./image/251ab2a15b32c9fa6b035875b68cf131c941d4fd.jpg
        ./image/35db33532417f83ff516072a22d6fb4cf33b1b8c.jpg
        ./image/574e569d44087c75e41a33552a9745d4e07cb12b.jpg
        ./image/75aa4835c28c43e8d5c88bd4cb9ed9c4538ca7b9.jpg
        ./image/8f0f01375b5049e0aa604c7eb11caa535a92e0ec.jpg
        ./image/aa435db0553e61b9367f46a700f2c8a3b35afea9.jpg
        ./image/d5f0c0bdc80f211b66b9b5831814843c1e51844f.jpg
        ./image/e1b1a2accf1a91351b16c4a49ec3d95172fc72e1.jpg
        ./image/ee59c9abbaf8693a6f1637e1e129a763348e86de.jpg
        ./image/0655c2a84be9269d8d76c77df7f5d08900e52c7d.jpg
        ./image/0cc250aaf8b7de81a762b346cddd23b52dc69f2c.jpg
        ./image/19f7b905e0e2394df866f4dc146d20c20a891ebc.jpg
        ./image/23aa3d56b6a30f8a20d5893e609696fd96beb386.jpg
        ./image/251ab2a15b32c9fa6b035875b68cf131c941d4fd.jpg
        ./image/35db33532417f83ff516072a22d6fb4cf33b1b8c.jpg
        ./image/574e569d44087c75e41a33552a9745d4e07cb12b.jpg
        ./image/75aa4835c28c43e8d5c88bd4cb9ed9c4538ca7b9.jpg
        ./image/8f0f01375b5049e0aa604c7eb11caa535a92e0ec.jpg
        ./image/aa435db0553e61b9367f46a700f2c8a3b35afea9.jpg
        ./image/d5f0c0bdc80f211b66b9b5831814843c1e51844f.jpg
        ./image/e1b1a2accf1a91351b16c4a49ec3d95172fc72e1.jpg
        ./image/ee59c9abbaf8693a6f1637e1e129a763348e86de.jpg
        `);
    });


    // 点击下载
    downloadBtn.addEventListener('click', () => {
        alert('该网页展示的图片禁止下载');
    });


    // 点击删除
    deleteBtn.addEventListener('click', () => {
        alert('静态版页面无此功能！');
    });


    image.get(`./image/0655c2a84be9269d8d76c77df7f5d08900e52c7d.jpg
    ./image/0cc250aaf8b7de81a762b346cddd23b52dc69f2c.jpg
    ./image/19f7b905e0e2394df866f4dc146d20c20a891ebc.jpg
    ./image/23aa3d56b6a30f8a20d5893e609696fd96beb386.jpg
    ./image/251ab2a15b32c9fa6b035875b68cf131c941d4fd.jpg
    ./image/35db33532417f83ff516072a22d6fb4cf33b1b8c.jpg
    ./image/574e569d44087c75e41a33552a9745d4e07cb12b.jpg
    ./image/75aa4835c28c43e8d5c88bd4cb9ed9c4538ca7b9.jpg
    ./image/8f0f01375b5049e0aa604c7eb11caa535a92e0ec.jpg
    ./image/aa435db0553e61b9367f46a700f2c8a3b35afea9.jpg
    ./image/d5f0c0bdc80f211b66b9b5831814843c1e51844f.jpg
    ./image/e1b1a2accf1a91351b16c4a49ec3d95172fc72e1.jpg
    ./image/ee59c9abbaf8693a6f1637e1e129a763348e86de.jpg
    ./image/0655c2a84be9269d8d76c77df7f5d08900e52c7d.jpg
    ./image/0cc250aaf8b7de81a762b346cddd23b52dc69f2c.jpg
    ./image/19f7b905e0e2394df866f4dc146d20c20a891ebc.jpg
    ./image/23aa3d56b6a30f8a20d5893e609696fd96beb386.jpg
    ./image/251ab2a15b32c9fa6b035875b68cf131c941d4fd.jpg
    ./image/35db33532417f83ff516072a22d6fb4cf33b1b8c.jpg
    ./image/574e569d44087c75e41a33552a9745d4e07cb12b.jpg
    ./image/75aa4835c28c43e8d5c88bd4cb9ed9c4538ca7b9.jpg
    ./image/8f0f01375b5049e0aa604c7eb11caa535a92e0ec.jpg
    ./image/aa435db0553e61b9367f46a700f2c8a3b35afea9.jpg
    ./image/d5f0c0bdc80f211b66b9b5831814843c1e51844f.jpg
    ./image/e1b1a2accf1a91351b16c4a49ec3d95172fc72e1.jpg
    ./image/ee59c9abbaf8693a6f1637e1e129a763348e86de.jpg
    `);
}
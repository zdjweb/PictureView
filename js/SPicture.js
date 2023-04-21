const SPicture = (() => {
    const canvas = new WeakMap,
    src = new WeakMap,
    position = new WeakMap,
    scale = new WeakMap,
    image = new WeakMap,
    size = new WeakMap,
    canvasResize = (canvas) => {
        Object.assign(canvas, {
            width: canvas.offsetWidth,
            height: canvas.offsetHeight
        });
    },
    positionSet = (configString) => {
        const config = configString.split('|'),
        positionObject = {
            horizontal: 0,
            vertical: 0
        };
        for (const i of config) {
            switch(i) {
                case 'left':
                    positionObject.horizontal -= 1;
                    break;
                case 'right':
                    positionObject.horizontal += 1;
                    break;
                case 'top':
                    positionObject.vertical -= 1;
                    break;
                case 'bottom':
                    positionObject.vertical += 1;
                    break;
                case 'center':
                    positionObject.horizontal = 0;
                    positionObject.vertical = 0;
                    break;
                case 'horizontal_center':
                    positionObject.horizontal = 0;
                    break;
                case 'vertical_center':
                    positionObject.vertical = 0;
                    break;
            }
        }
        position.set(this, positionObject);
    },
    scaleSet = (configString) => {
        const config = configString.split('|'),
        scaleObject = {
            type: 0
        };
        for (const i of config) {
            switch(i) {
                case 'inside':
                    scaleObject.type = -1;
                    break;
                case 'initial':
                    scaleObject.type = 0;
                    break;
                case 'crop':
                    scaleObject.type = 1;
                    break;
                case 'fit':
                    scaleObject.type = 2;
                    break;
            }
        }
        scale.set(this, scaleObject);
    },
    canvasInit = () => {
        const canvas = document.createElement('canvas');
        Object.assign(canvas.style, {
            display: 'block',
            width: '100%',
            height: '100%'
        });
        return canvas;
    },
    drawBackground = (canvas, background) => {
        const context = canvas.getContext('2d');
        context.save();
        context.fillStyle = background;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
    },
    drawImage = (canvas, src) => {
        const needDrawImage = image.get(this);
        if (needDrawImage) {
            const imageSize = size.get(this),
            drawPosition = {
                x: 0,
                y: 0
            },
            configPosition = position.get(this),
            horizontal = configPosition.horizontal,
            vertical = configPosition.vertical,
            configScale = scale.get(this),
            context = canvas.getContext('2d');
            let width = imageSize.width,
            height = imageSize.height;
            const ratio = width / height;
            switch(configScale.type) {
                case -1:
                    if (ratio > canvas.width / canvas.height) {
                        width = canvas.width;
                        height = width / ratio;
                    } else {
                        height = canvas.height;
                        width = height * ratio;
                    }
                    break;
                case 1:
                    if (ratio > canvas.width / canvas.height) {
                        height = canvas.height;
                        width = height * ratio;
                    } else {
                        width = canvas.width;
                        height = width / ratio;
                    }
                    break;
                case 2:
                    width = canvas.width;
                    height = canvas.height;
                    break;
            }
            if (horizontal == 0) {
                drawPosition.x = (canvas.width - width) / 2;
            } else if (horizontal < 0) {
                drawPosition.x = 0;
            } else {
                drawPosition.x = canvas.width - width;
            }
            if (vertical == 0) {
                drawPosition.y = (canvas.height - height) / 2;
            } else if (vertical < 0) {
                drawPosition.y = 0;
            } else {
                drawPosition.y = canvas.height - height;
            }
            context.drawImage(needDrawImage, drawPosition.x, drawPosition.y, width, height);
        } else {
            const needDrawImage = document.createElement('img');
            needDrawImage.src = src;
            needDrawImage.addEventListener('load', () => {
                drawImage(canvas, src);
            });
            image.set(this, needDrawImage);
            size.set(this, {
                width: needDrawImage.width,
                height: needDrawImage.height
            });
        }
    };
    return class {
        get canvas() {
            return canvas.get(this);
        }
        set canvas(newCanvas) {
            if (this.canvas == null) {
                canvas.set(this, newCanvas);
            }
        }
        get src() {
            return src.get(this);
        }
        set src(newSrc) {
            src.set(this, newSrc);
            image.set(this, null);
            this.draw();
        }
        get position() {
            return position.get(this);
        }
        set position(newPosition) {
            position.set(this, newPosition);
        }
        constructor({ container, background, src, position, scale }) {
            if (container != null) {
                const canvas = this.canvas = canvasInit();
                positionSet(position);
                scaleSet(scale);
                this.background = background;
                window.addEventListener('DOMContentLoaded', () => {
                    container.appendChild(canvas);
                });
                window.addEventListener('load', () => {
                    canvasResize(canvas);
                    drawBackground(canvas, background);
                    drawImage(canvas, src);
                });
                window.addEventListener('resize', () => {
                    canvasResize(canvas);
                    drawBackground(canvas, background);
                    drawImage(canvas, src);
                });
            }
        }
        draw() {
            const canvas = this.canvas;
            drawBackground(canvas, this.background);
            drawImage(canvas, this.src);
        }
    }
})();
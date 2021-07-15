import SpriteSheet from 'https://jilijo01.github.io/SpriteSheet.js';
import {loadImage, loadLevel} from 'https://jilijo01.github.io/loaders.js';
//const context = document.getElementById('screen').getContext('2d');
constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this._firstConnection = false;
            var context = this._shadowRoot.getElementById('screen').getContext('2d');
            function loadImage(url) {
                return new Promise(resolve => {
                    const image = new Image();
                    image.addEventListener('load', () => {
                        resolve(image);
                    });
                    image.src = url;
                });
            }

            class SpriteSheet {
                constructor(image, w = 16, h = 16) {
                    this.image = image;
                    this.width = w;
                    this.height = h;
                    this.tiles = new Map();
                }

                define(name, x, y) {
                    const buffer = document.createElement('canvas');
                    buffer.height = this.height;
                    buffer.width = this.width;
                    buffer
                        .getContext('2d')
                        .drawImage(
                            this.image,
                            this.width * x,
                            this.height * y,
                            this.width,
                            this.height,
                            0,
                            0,
                            this.width,
                            this.height);
                    this.tiles.set(name, buffer);
                }

                draw(name, context, x, y) {
                    const buffer = this.tiles.get(name);
                    context.drawImage(buffer, x, y);
                }

                drawTile(name, context, x, y) {
                    this.draw(name, context, x * this.width, y * this.height);
                }
            };

            loadImage('https://jilijo01.github.io/tiles.png')
                .then(image => {
                    const sprites = new SpriteSheet(image, 16, 16);
                    sprites.define('ground', 0, 0);
                    sprites.define('sky', 3, 23);
                    sprites.draw('sky', context, 180, 162);
                    for (let x = 0; x < 25; ++x) {
                        for (let y = 0; y < 14; ++y) {
                            sprites.drawTile('sky', context, x, y);
                        }
                    }
                    for (let x = 0; x < 25; ++x) {
                        for (let y = 12; y < 14; ++y) {
                            sprites.drawTile('ground', context, x, y);
                        }
                    }
                });
        }
/*
function drawBackground(background, context, sprites) {
    background.ranges.forEach(([x1, x2, y1, y2]) => {
        for (let x = x1; x < x2; ++x) {
            for (let y = y1; y < y2; ++y) {
                sprites.drawTile(background.tile, context, x, y);
            }
        }
    });
}


loadImage('/img/tiles.png')
.then(image => {
    const sprites = new SpriteSheet(image);
    sprites.define('ground', 0, 0);
    sprites.define('sky', 3, 23);

    loadLevel('1-1')
    .then(level => {
        level.backgrounds.forEach(bg => {
            drawBackground(bg, context, sprites);
        });
    });
});
*/

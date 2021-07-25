(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <h1>Super Mario</h1>
    <canvas id="screen" width="640" height="640"></canvas>
        
    `;
    customElements.define('com-sap-sample-helloworld1', class HelloWorld1 extends HTMLElement {


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

                define(name, x, y, width, height) {
                    const buffer = document.createElement('canvas');
                    buffer.height = height;
                    buffer.width = width;
                    buffer
                        .getContext('2d')
                        .drawImage(
                            this.image,
                            x,
                            y,
                            width,
                            height,
                            0,
                            0,
                            width,
                            height);
                    this.tiles.set(name, buffer);
                }

                defineTile(name, x, y) {
                    this.define(name, x * this.width, y * this.height, this.width, this.height);
                }

                draw(name, context, x, y) {
                    const buffer = this.tiles.get(name);
                    context.drawImage(buffer, x, y);
                }

                drawTile(name, context, x, y) {
                    this.draw(name, context, x * this.width, y * this.height);
                }
            };

            function loadLevel(name) {
                return fetch(`https://jilijo01.github.io/${name}.json`)
                    .then(r => r.json());
            }

            function drawBackground(background, context, sprites) {
                background.ranges.forEach(([x1, x2, y1, y2]) => {
                    for (let x = x1; x < x2; ++x) {
                        for (let y = y1; y < y2; ++y) {
                            sprites.drawTile(background.tile, context, x, y);
                        }
                    }
                });
            }

            function loadMarioSprite() {
                return loadImage('https://jilijo01.github.io/characters.gif')
                    .then(image => {
                        const sprites = new SpriteSheet(image, 16, 16);
                        sprites.define('idle', 276, 44, 16, 16);
                        return sprites;
                    })
            };

            function loadBackgroundSprites() {
                return loadImage('https://jilijo01.github.io/tiles.png')
                    .then(image => {
                        const sprites = new SpriteSheet(image, 16, 16);
                        sprites.defineTile('ground', 0, 0);
                        sprites.defineTile('sky', 3, 23);
                        return sprites;
                    })
            };

            class Compositor {
                constructor() {
                    this.layers = [];
                }
                draw(context) {
                    this.layers.forEach(layers => {
                        layers(context);
                    });
                }
            };

            function createBackgroundLayer(backgrounds, sprites) {
                const buffer = document.createElement('canvas');
                buffer.width = 256,
                    buffer.height = 240,
                    backgrounds.forEach(background => {
                        drawBackground(background, buffer.getContext('2d'), sprites);
                    });

                return function drawBackgroundLayer(context) {
                    context.drawImage(buffer, 0, 0);
                }
            }

            function createSpriteLayer(entity) {
                return function drawSpritesLayer(context) {
                    entity.draw(context);


                }
            }

            function createMario(){
                return loadMarioSprite()
                .then(sprite => {
                    const mario = new entity();
                    mario.pos.set(64, 180);
                    mario.vel.set(2, -10);
    
                    mario.draw = function drawMario (context){
                        sprite.draw('idle', context, this.pos.x, this.pos.y);
                    }
    
                    mario.update = function updateMario() {
                        this.pos.x += this.vel.x;
                        this.pos.y += this.vel.y;
                    };
                    return mario;
                });

            }

            class Vec2 {
                constructor(x, y) {
                    this.set(x, y);
                }
                set(x, y) {
                    this.x = x;
                    this.y = y;
                }
            }

            class entity {
                constructor() {
                    this.pos = new Vec2(0, 0);
                    this.vel = new Vec2(0, 0);
                }
            }

            Promise.all([
                createMario(),
                loadBackgroundSprites(),
                loadLevel('1-1'),

            ])
                .then(([mario, backgroundSprites, level]) => {
                    const comp = new Compositor();

                    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
                    comp.layers.push(backgroundLayer);
                    const gravity = 0.5;
 
                    const spriteLayer = createSpriteLayer(mario);
                    comp.layers.push(spriteLayer);

                    let deltaTime = 0;
                    let lastTime = 0;

                    function update(time) {
                        deltaTime = time - lastTime;
                        console.log(deltaTime, time)
                        comp.draw(context);
                        mario.update();
                        mario.vel.y += gravity;
                        requestAnimationFrame(update);

                        lastTime = time;
                    }

                    update();

                });

        }

        //Fired when the widget is added to the html DOM of the page
        connectedCallback() {
            this._firstConnection = true;
            this.redraw();
        }

        //Fired when the widget is removed from the html DOM of the page (e.g. by hide)
        disconnectedCallback() {

        }

        //When the custom widget is updated, the Custom Widget SDK framework executes this function first
        onCustomWidgetBeforeUpdate(oChangedProperties) {

        }

        //When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
        onCustomWidgetAfterUpdate(oChangedProperties) {
            if (this._firstConnection) {
                this.redraw();
            }
        }

        //When the custom widget is removed from the canvas or the analytic application is closed
        onCustomWidgetDestroy() {
        }


        //When the custom widget is resized on the canvas, the Custom Widget SDK framework executes the following JavaScript function call on the custom widget
        // Commented out by default.  If it is enabled, SAP Analytics Cloud will track DOM size changes and call this callback as needed
        //  If you don't need to react to resizes, you can save CPU by leaving it uncommented.
        /*
        onCustomWidgetResize(width, height){
            redraw()
        }
        */

        redraw() {
        }
    });
})();

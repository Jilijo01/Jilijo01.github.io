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

            //Compositor.js
            class Compositor {
                constructor() {
                    this.layers = [];
                }

                draw(context) {
                    this.layers.forEach(layer => {
                        layer(context);
                    });
                }
            }
            //Compositor.js

            //Timer.js
            class Timer {
                constructor(deltaTime = 1 / 60) {
                    let accumulatedTime = 0;
                    let lastTime = 0;

                    this.updateProxy = (time) => {
                        accumulatedTime += (time - lastTime) / 1000;

                        while (accumulatedTime > deltaTime) {
                            this.update(deltaTime);
                            accumulatedTime -= deltaTime;
                        }

                        lastTime = time;

                        this.enqueue();
                    }
                }

                enqueue() {
                    requestAnimationFrame(this.updateProxy);
                }

                start() {
                    this.enqueue();
                }
            }
            //Timer.js

            //math.js
             class Vec2 {
                constructor(x, y) {
                    this.set(x, y);
                }

                set(x, y) {
                    this.x = x;
                    this.y = y;
                }
            }
            //math.js

            //Loaders.js
            function loadImage(url) {
                return new Promise(resolve => {
                    const image = new Image();
                    image.addEventListener('load', () => {
                        resolve(image);
                    });
                    image.src = url;
                });
            }

            function loadLevel(name) {
                return fetch(`https://jilijo01.github.io/${name}.json`)
                    .then(r => r.json());
            }
            //Loaders.js

            //Entity.js
            class Trait {
                constructor(name) {
                    this.NAME = name;
                }

                update() {
                    console.warn('Unhandled update call in Trait');
                }
            }

            class Entity {
                constructor() {
                    this.pos = new Vec2(0, 0);
                    this.vel = new Vec2(0, 0);

                    this.traits = [];
                }

                addTrait(trait) {
                    this.traits.push(trait);
                    this[trait.NAME] = trait;
                }

                update(deltaTime) {
                    this.traits.forEach(trait => {
                        trait.update(this, deltaTime);
                    });
                }
            }
            //Entity.js

            //jump.js
            class Jump extends Trait {
                constructor() {
                    super('jump');

                    this.duration = 0.5;
                    this.engageTime = 0;

                    this.velocity = 200;
                }

                start() {
                    this.engageTime = this.duration;
                }

                cancel() {
                    this.engageTime = 0;
                }

                update(entity, deltaTime) {
                    if (this.engageTime > 0) {
                        entity.vel.y = -this.velocity;
                        this.engageTime -= deltaTime;
                    }
                }
            }
            //jump.js

            //velocity.js
            class Velocity extends Trait {
                constructor() {
                    super('velocity');
                }

                update(entity, deltaTime) {
                    entity.pos.x += entity.vel.x * deltaTime;
                    entity.pos.y += entity.vel.y * deltaTime;
                }
            }
            //velocity.js
            
            //spritesheet.js
            class SpriteSheet {
                constructor(image, width, height) {
                    this.image = image;
                    this.width = width;
                    this.height = height;
                    this.tiles = new Map();
                }
            
                define(name, x, y, width, height) {
                    const buffer = document.createElement('canvas');
                    buffer.width = width;
                    buffer.height = height;
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
                    this.tiles.set(name, buffer)
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
            }
            //spritesheet.js

            //sprites.js
            function loadMarioSprite() {
                return loadImage('https://jilijo01.github.io/characters.gif')
                    .then(image => {
                        const sprites = new SpriteSheet(image, 16, 16);
                        sprites.define('idle', 276, 44, 16, 16);
                        return sprites;
                    });
            }

            function loadBackgroundSprites() {
                return loadImage('https://jilijo01.github.io/tiles.png')
                    .then(image => {
                        const sprites = new SpriteSheet(image, 16, 16);
                        sprites.defineTile('ground', 0, 0);
                        sprites.defineTile('sky', 3, 23);
                        return sprites;
                    });
            }
            //sprites.js

            //Entities.js
            function createMario() {
                return loadMarioSprite()
                    .then(sprite => {
                        const mario = new Entity();

                        mario.addTrait(new Velocity());
                        mario.addTrait(new Jump());

                        mario.draw = function drawMario(context) {
                            sprite.draw('idle', context, this.pos.x, this.pos.y);
                        }

                        return mario;
                    });
            }
            //Entities.js

            //layers.js
            function drawBackground(background, context, sprites) {
                background.ranges.forEach(([x1, x2, y1, y2]) => {
                    for (let x = x1; x < x2; ++x) {
                        for (let y = y1; y < y2; ++y) {
                            sprites.drawTile(background.tile, context, x, y);
                        }
                    }
                });
            }

            function createBackgroundLayer(backgrounds, sprites) {
                const buffer = document.createElement('canvas');
                buffer.width = 256;
                buffer.height = 240;

                backgrounds.forEach(background => {
                    drawBackground(background, buffer.getContext('2d'), sprites);
                });

                return function drawBackgroundLayer(context) {
                    context.drawImage(buffer, 0, 0);
                };
            }

            function createSpriteLayer(entity) {
                return function drawSpriteLayer(context) {
                    entity.draw(context);
                };
            }
            //layers.js

            //keyboardState.js
            const PRESSED = 1;
            const RELEASED = 0;

            class KeyboardState {
                constructor() {
                    // Holds the current state of a given key
                    this.keyStates = new Map();

                    // Holds the callback functions for a key code
                    this.keyMap = new Map();
                }

                addMapping(keyCode, callback) {
                    this.keyMap.set(keyCode, callback);
                }

                handleEvent(event) {
                    const { keyCode } = event;

                    if (!this.keyMap.has(keyCode)) {
                        // Did not have key mapped.
                        return;
                    }

                    event.preventDefault();

                    const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

                    if (this.keyStates.get(keyCode) === keyState) {
                        return;
                    }

                    this.keyStates.set(keyCode, keyState);
                    console.log(this.keyStates);

                    this.keyMap.get(keyCode)(keyState);
                }

                listenTo(window) {
                    ['keydown', 'keyup'].forEach(eventName => {
                        window.addEventListener(eventName, event => {
                            this.handleEvent(event);
                        });
                    });
                }
            }
            //keyboardstate.js

            Promise.all([
                createMario(),
                loadBackgroundSprites(),
                loadLevel('1-1'),
            ])
            .then(([mario, backgroundSprites, level]) => {
                const comp = new Compositor();
            
                const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
                comp.layers.push(backgroundLayer);
            
                const gravity = 2000;
                mario.pos.set(64, 180);
            
            
                const SPACE = 32;
                const input = new KeyboardState();
                input.addMapping(SPACE, keyState => {
                    if (keyState) {
                        mario.jump.start();
                    } else {
                        mario.jump.cancel();
                    }
                });
                input.listenTo(window);
            
            
                const spriteLayer = createSpriteLayer(mario);
                comp.layers.push(spriteLayer);
            
                const timer = new Timer(1/60);
                timer.update = function update(deltaTime) {
                    mario.update(deltaTime);
            
                    comp.draw(context);
            
                    mario.vel.y += gravity * deltaTime;
                }
            
                timer.start();
            });
        };




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

        redraw() { }
    });
})();

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
            this.newScript = document.createElement('script');
            this.newScript.setAttribute('type', 'module');
            this.newScript.setAttribute('src', 'https://jilijo01.github.io/main.js');
            this._shadowRoot.appendChild(this.newScript);
           var context = this._shadowRoot.getElementById('screen').getContext('2d');
            
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

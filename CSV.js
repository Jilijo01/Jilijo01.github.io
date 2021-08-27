(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <body>
    <form id="myForm">
        <input type="file" id="csvFile" accept=".csv" />
        <br />
        <input type="submit" value="Submit" />
    </form>
    </body>
    `;

    customElements.define('com-sap-sample-helloworld2', class HelloWorld1 extends HTMLElement {


        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this._firstConnection = false;

            const myForm = this._shadowRoot.getElementById("myForm");
            const csvFile = this._shadowRoot.getElementById("csvFile");

            myForm.addEventListener("submit", function (e) {
                e.preventDefault();
                console.log("Form submitted");
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
        // Commented out by default
        /*
        onCustomWidgetResize(width, height){
        
        }
        */

        // Getters and setters
        get data() {
            return this.contentVar;
        }


        redraw() { }
    });

})();

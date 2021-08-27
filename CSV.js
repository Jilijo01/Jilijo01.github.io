(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <input type="file" id="uploadfile" onChange="readImage(this)">
    `;

    customElements.define('com-sap-sample-helloworld2', class HelloWorld1 extends HTMLElement {


        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this._firstConnection = false;
            this.contentVar = ["20", "PS2", "FS", "200\r"];

            var obj_csv = {
                size: 0,
                dataFile: []
            };

            function readImage(input) {
                console.log(input)
                if (input.files && input.files[0]) {
                    let reader = new FileReader();
                    reader.readAsBinaryString(input.files[0]);
                    reader.onload = function (e) {
                        console.log(e);
                        obj_csv.size = e.total;
                        obj_csv.dataFile = e.target.result
                        console.log(obj_csv.dataFile)
                        parseData(obj_csv.dataFile)

                    }
                }
            }

            function parseData(data) {
                let csvData = [];
                let lbreak = data.split("\n");
                lbreak.forEach(res => {
                    csvData.push(res.split(","));
                });
                console.table(csvData);
            }
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

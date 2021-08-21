(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <input type="file" id="fileUpload" />
    <input type="button" id="upload" value="Upload" onclick="Upload()" />
    <hr />
    <div id="dvCSV">
    </div>
    `;

    customElements.define('com-sap-sample-helloworld2', class HelloWorld1 extends HTMLElement {


        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this._firstConnection = false;
            /*let btn_upload = this._shadowRoot.getElementById('btn-upload-csv').addEventListener('click', () => {
                Papa.parse(this._shadowRoot.getElementById('upload-csv').files[0],{
                download: true,
                header: false,
                complete: function(results){
                    console.log(results);
                }
            }
            )
        })*/
            function Upload() {
                var fileUpload = this._shadowRoot.getElementById("fileUpload");
                var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
                if (regex.test(fileUpload.value.toLowerCase())) {
                    if (typeof (FileReader) != "undefined") {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var table = this._shadowRoot.createElement("table");
                            var rows = e.target.result.split("\n");
                            for (var i = 0; i < rows.length; i++) {
                                var cells = rows[i].split(",");
                                if (cells.length > 1) {
                                    var row = table.insertRow(-1);
                                    for (var j = 0; j < cells.length; j++) {
                                        var cell = row.insertCell(-1);
                                        cell.innerHTML = cells[j];
                                    }
                                }
                            }
                            var dvCSV = this._shadowRoot.getElementById("dvCSV");
                            dvCSV.innerHTML = "";
                            dvCSV.appendChild(table);
                        }
                        reader.readAsText(fileUpload.files[0]);
                    } else {
                        alert("This browser does not support HTML5.");
                    }
                } else {
                    alert("Please upload a valid CSV file.");
                }
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

        redraw() { }


    });

})();

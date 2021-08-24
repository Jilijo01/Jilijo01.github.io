(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <form id="myForm">
    <input type="file" id="csvFile" accept=".csv" />
    <br />
    <input type="submit" value="Submit" />
    </form>
    <p id="data"></p>
    `;

    customElements.define('com-sap-sample-helloworld2', class HelloWorld1 extends HTMLElement {


        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this._firstConnection = false;
            this._data = ['rstConnection'];
            

            const myForm = this._shadowRoot.getElementById("myForm");
            const csvFile = this._shadowRoot.getElementById("csvFile");
          
            myForm.addEventListener("submit", function (e) {
              e.preventDefault();
              console.log("Form submitted");
            });

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
            function csvToArray(str, delimiter = ",") {
                // slice from start of text to the first \n index
                // use split to create an array from string by delimiter
                const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
              
                // slice from \n index + 1 to the end of the text
                // use split to create an array of each csv value row
                const rows = str.slice(str.indexOf("\n") + 1).split("\n");
              
                // Map the rows
                // split values from each row into an array
                // use headers.reduce to create an object
                // object properties derived from headers:values
                // the object passed as an element of the array
                const arr = rows.map(function (row) {
                  const values = row.split(delimiter);
                  const el = headers.reduce(function (object, header, index) {
                    object[header] = values[index];
                    return object;
                  }, {});
                  return el;
                });
              
                // return the array
                return arr;
              }
              
              myForm.addEventListener("submit", function (e) {
                e.preventDefault();
                const input = csvFile.files[0];
                const reader = new FileReader();
          
                reader.onload = function (e) {
                  const text = e.target.result;
                  var data2 = csvToArray(text);
                  //document.write(JSON.stringify(data));
                 
                };
                
                reader.readAsText(input);
              });
            //this._shadowRoot.getElementById("data").textContent += data2;
            console.log(data2);
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
            return this._data;
        }

        redraw() { }


    });

})();

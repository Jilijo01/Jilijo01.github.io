(function()  {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <h1>Space Invaders</h1>
	<div class="grid"></div>
	<style>
	.grid {
	width: 300px;
	height: 300px;
	border: solid black 1px;
	display: flex;
	flex-wrap: wrap;
	}

	.grid div {
		width: 20px;
		height: 20px;
	}

	.invader {
		background-color: purple;
		border-radius: 10px;
	}

	.shooter {
		background-color: green;
	}

	.laser {
		background-color: orange;
	}

	.boom {
		background-color: red;
	}

	</style>
    `;

    customElements.define('com-sap-sample-helloworld1', class HelloWorld1 extends HTMLElement {


	    constructor() {
		super();
	    	this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this._firstConnection = false;
	    "use strict";
	    const grid = document.querySelector('.grid');
	    for (let i = 0; i < 225; i++) {
	   	const square = document.createElement('div');
	    	this._shadowRoot.querySelector('.grid').appendChild(square);
		}
	    const squares = Array.from(document.querySelectorAll('.grid div'))

	    const alienInvaders = [
	    0,1,2,3,4,5,6,7,8,9,
	    15,16,17,18,19,20,21,22,23,24,
	    30,31,32,33,34,35,36,37,38,39]
            		}
	    //function testing() {
  		for (let i = 0; i < alienInvaders.length; i++) {
    			if(!aliensRemoved.includes(i)) {
     				 squares[alienInvaders[i]].classList.add('invader')
			    }
			  }
			//}

	    //testing()
        //Fired when the widget is added to the html DOM of the page
        connectedCallback(){
            this._firstConnection = true;
            this.redraw();
        }

         //Fired when the widget is removed from the html DOM of the page (e.g. by hide)
        disconnectedCallback(){

        }

         //When the custom widget is updated, the Custom Widget SDK framework executes this function first
		onCustomWidgetBeforeUpdate(oChangedProperties) {

		}

        //When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
		onCustomWidgetAfterUpdate(oChangedProperties) {
            if (this._firstConnection){
                this.redraw();
            }
        }

        //When the custom widget is removed from the canvas or the analytic application is closed
        onCustomWidgetDestroy(){
        }


        //When the custom widget is resized on the canvas, the Custom Widget SDK framework executes the following JavaScript function call on the custom widget
        // Commented out by default.  If it is enabled, SAP Analytics Cloud will track DOM size changes and call this callback as needed
        //  If you don't need to react to resizes, you can save CPU by leaving it uncommented.
        /*
        onCustomWidgetResize(width, height){
            redraw()
        }
        */

        redraw(){
        }
    });
})();

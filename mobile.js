// code needed for mobile insertion point tricks for iphone

/**
* Focus the text input box, which causes the onscreen
* keyboard to display.
*/
Richie.prototype.focusTextbox = function() {
	if( this.m_keyboardInput.focused == undefined ) {
		this.m_keyboardInput.focused = false;
	}
	Richie.trace( this.m_keyboardInput.focused );
	if( this.m_keyboardInput.focused == false ) {
		Richie.trace( "focusing input textbox" );
		this.m_keyboardInput.focused = true;
		this.m_keyboardInput.focus();
	}	
	else {
		Richie.trace( "not refocusing input textbox" );
	}
}	

/**
* updated the absolute position of the input control that receives 
* text input. There is a fudge factor here that lines the cursor up with 
* the text that is slightly different on different devices. TODO: find a
* better way of getting positioning right across different devices.
*/
Richie.prototype.repositionInputBox = function() {
	this.m_keyboardInput.style.top = this.m_cursor.offsetTop - 2 + "px";
	this.m_keyboardInput.style.left = this.m_cursor.offsetLeft - 6 + "px";
}

/**
* On mobile devices we have to fool the phone into thinking that
* an html input box is active. We do this via a floating input control
* that remains focused at all times. This method inserts the text
* box into the dom initially.
*/
Richie.prototype.insertKeyboardInput = function() {
	var el = document.createElement( 'input' );
	el.type = 'text';
	el.id = 'keyboardinput';
	
	this.m_editor.appendChild( el );
	this.m_keyboardInput = el;
}

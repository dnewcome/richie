Richie.prototype.doStyling = function( evt ) {
	// keyboard shortcuts for toggling styles
	// carryover from pc browser version.
	if ( evt.keyCode == 66 && evt.ctrlKey == true ) {
		evt.preventDefault();
		this.toggleStyling( 'B' );
	}
	else if ( evt.keyCode == 73 && evt.ctrlKey == true ) {
		evt.preventDefault();
		this.toggleStyling( 'I' );
	}
	else if ( evt.keyCode == 85 && evt.ctrlKey == true ) {
		evt.preventDefault();
		this.toggleStyling( 'U' );
	}
}

/**
* Insert text styling 
* @style is uppercase tag name for bold, italic, etc
*/
Richie.prototype.toggleStyling = function( style ) {
	var cursor = this.m_cursor;
	var currentElement = cursor.parentNode;
	if( currentElement.tagName == style ) {
		// split current node 
		if( cursor.previousSibling ) {
			var boldElement = document.createElement( style );
			boldElement.appendChild( cursor.previousSibling );
			currentElement.parentNode.insertBefore( boldElement, currentElement );
		}
		currentElement.parentNode.insertBefore( cursor, currentElement );
	}
	else {
		var boldElement = document.createElement( style );
		currentElement.insertBefore( boldElement, cursor );
		boldElement.appendChild( cursor );
	}
	if( Richie.isMobile ) {
		this.m_keyboardInput.focus();
	}
	// put focus back on the text input area after button click
	// otherwise the zero-width bold span cannot be typed in.
	this.m_editor.focus();
}

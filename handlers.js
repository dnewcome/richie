Richie.prototype.enterKey = function( evt ) {
	var cursor = this.m_cursor; 
	// char code is 10 on iphone for some reason
	if( evt.keyCode == 13 || evt.keyCode == 10 ) {
		Richie.trace( 'handling enter key' );
		var ins = document.createElement( 'p' );
		var restofline = cursor.nextSibling;
		var nextparagraph = cursor.parentNode.nextSibling;
		var outernode = cursor.parentNode.parentNode;
		ins.appendChild( cursor );
		if( restofline != null ) {
			ins.appendChild( restofline );
		}
		outernode.insertBefore( ins, nextparagraph );
		evt.preventDefault();
	}
}

Richie.prototype.backspaceKey = function( evt ) {
	var cursor = this.m_cursor; 
	// backspace
	// iphone registers 127, other browsers use 8
	if( evt.keyCode == 8 || evt.keyCode == 127 ) {
		if( cursor.previousSibling ) {
			Richie.trace( "backspace: prev sibling found" );
			var prevlength = cursor.previousSibling.nodeValue.length;
			Richie.trace( "prevlength: " + prevlength );

			// workaround for iphone which doesn't update length of text node correctly
			// we have to remove two chars, and I don't know why. The first backspace
			// removes two chars, but subsequent calls remove only one.
			if( Richie.isIphone ) {
				cursor.previousSibling.splitText( prevlength - 2 );
			}
			else {
				cursor.previousSibling.splitText( prevlength - 1 );
			}
			cursor.parentElement.removeChild( cursor.previousSibling );
		}

		// if we hit the end of a node, we merge the two nodes
		else {
			Richie.trace( "end of node" );
			var contents = cursor.parentNode.innerHTML;
			var nodeToDelete = cursor.parentNode;
			var previousNode = nodeToDelete.previousSibling;
			cursor.parentNode.parentNode.removeChild( nodeToDelete );
			previousNode.innerHTML += contents;
		}
	}
}

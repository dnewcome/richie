// handler functions for non-printable keys

Richie.prototype.enterKey = function( evt ) {
	var cursor = this.m_cursor;
	// char code is 10 on iphone for some reason
	if( evt.keyCode == 13 || evt.keyCode == 10 ) {
		Richie.trace( 'handling enter key' );
		var ins = document.createElement( 'p' );
		var restofline = cursor.nextSibling;
		var nextparagraph = cursor.parentNode.nextSibling;
		var outernode = cursor.parentNode.parentNode;
		//var outernode = cursor.parentNode;
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

Richie.prototype.leftArrow = function( evt ) {
	var cursor = this.m_cursor;
	// navigation
	// should work on mobile devices that support arrow keys, iphone does not.
	if( evt.keyCode == 37 ) { // left arrow

		var rng = document.createRange();
		var prev = cursor.previousSibling;

		// we are at the edge of the node
		if( prev == null ) {
			Richie.trace( "node edge reached" );

			// if prev is still null, either we are either traversing an empty
			// node or we need to go up a level in the dom tree...
			// in the case that we find a previous non-empty element, we need
			// to not offset the range like we do for the nominal case below.
			// TODO: handle these cases.
			prev = cursor.parentNode.previousSibling.lastChild;

			// try to navigate up in tree
			/*
			if( prev == null ) {
				// check if we have reached the beginning of document
				if( cursor.parentNode.parentNode == content ) { return; }
				prev = cursor.parentNode.parentNode.lastChild;
			}
			*/
		}

		// length of the previous node - assumed to be text node
		if( prev.nodeValue ) {
		var prevlength = prev.nodeValue.length;

		rng.setStart( prev, prevlength - 1 );
		rng.setEnd( prev, prevlength - 1 );

		rng.insertNode( cursor );
		}
		else {
			cursor.parentNode.previousSibling.appendChild( cursor );
		}

	}
}

Richie.prototype.rightArrow = function( evt ) {
	var cursor = this.m_cursor;
	// right arrow
	if( evt.keyCode == 39 ) {
		var rng = document.createRange();
		var next = cursor.nextSibling;

		// we are at the edge of the node
		if( next == null ) {
			Richie.trace( "node edge reached" );
			next = cursor.parentNode.nextSibling;

			// detect end of document
			if( next == null ) { return; }
		}
		// length of the next node - assumed to be text node
		// we only need this to avoid errors if node is zero length
		// var nextlength = cursor.previousSibling.nodeValue.length;

		rng.setStart( next, 1 );
		rng.setEnd( next, 1 );
		rng.insertNode( cursor );
	}
}

Richie.prototype.tabKey = function( evt ) {
	var cursor = this.m_cursor;
	// tab
	if( evt.keyCode == 9 ) {
		var text = this.convertCharcode( evt.keyCode );

		// can't find a 'non-breaking tab', so insert nbsp
		var textNode = document.createTextNode( "\u00a0\u00a0\u00a0\u00a0" );
		cursor.parentNode.insertBefore( textNode, cursor );

		// keeps browser in focus
		evt.preventDefault();
		evt.stopPropagation();
	}
}

Richie.prototype.upArrow = function( evt ) {
	var cursor = this.m_cursor;
	// TODO: how to find correct position when traversing up
	// and down. currently we just go to end of line
	if( evt.keyCode == 38 ) { // up arrow
		var previousParagraph = cursor.parentNode.previousSibling;
		previousParagraph.appendChild( cursor );
		// not sure if we really need preventdefault with arrow keys
		evt.preventDefault();
	}
}

Richie.prototype.downArrow = function( evt ) {
	var cursor = this.m_cursor;
	if( evt.keyCode == 40 ) { // down arrow
		var previousParagraph = cursor.parentNode.nextSibling;
		previousParagraph.appendChild( cursor );
		// not sure if we really need preventdefault with arrow keys
		evt.preventDefault();
	}
}

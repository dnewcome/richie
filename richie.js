function Richie( dom ) {
	var me = this;
	dom.addEventListener( "keypress", function(event){ me.handleKey( event );}, false );
	dom.addEventListener( "keydown", function(event){ me.handleKeydown( event );}, false );
	dom.addEventListener( "click", function(event){ me.clickHandler( event );}, false );
	
	// TODO: not sure if we need the range for mobile
	// we used this for moving the cursor via click in the desktop version
	// this.m_range = document.createRange();
	this.m_editor = dom;
	this.m_cursor = null;
	this.m_editor.innerHTML = "<div class='content'><p></p></div>";
	this.m_content = dom.firstChild;
	this.m_keyboardInput = null;
	Richie.trace( dom.tabIndex );
	
	
	
	// tabIndex must be set to handle key events
	if( dom.tabIndex == null || dom.tabIndex == -1 ) {
		dom.tabIndex = 0;
	}
	this.insertCursor();
	if( !Richie.isMobile ) {
		setInterval( function() { me.blinkCursor(); }, 500 );
	}
	else {
		this.insertKeyboardInput();
	}
}

Richie.isMobile = true;
Richie.isIphone = false;
Richie.traceEnabled = true;
Richie.version = "0.1.1";

Richie.trace = function( msg ) {
	if( Richie.traceEnabled == true ) {
		console.log( msg );
	} 
};

/**
* blinkCursor is needed only for the desktop version. The
* Mobile version uses a floating text box.
*/
Richie.prototype.blinkCursor = function() {
	var cursor = this.m_cursor;
	if( cursor.style.visibility == 'hidden' ) {
		cursor.style.visibility = 'visible';
	}
	else {
		cursor.style.visibility = 'hidden';
	}
};

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

/**
* Initialize the editor by setting focus and positioning
* the input caret properly.
*/
Richie.prototype.init = function() {
	// on the iphone, trying to focus on load doesn't work
	if( Richie.isMobile ) {
		this.repositionInputBox();
		this.m_keyboardInput.focus();
	}
}

/**
* internally used to convert character codes trapped
* by key handlers to printable output in the DOM
*/
Richie.prototype.convertCharcode = function( code ) {
	return String.fromCharCode( code );
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
* main handler for events that need charCode (generally printable chars)
*/
Richie.prototype.handleKey = function( evt ) {
	Richie.trace( 'KeyPress - Key: ' + evt.keyCode + ' ' + 'Char: ' + evt.charCode );
	var code = evt.charCode;
	if( navigator.userAgent.match(/Opera/) ) {
		code = evt.keyCode;
	}
	Richie.trace( 'code: ' + code );

	var cursor = this.m_cursor;
	var el = cursor.parentElement;

	this.enterKey( evt );

	// space
	if( evt.charCode == 32 ) { 
		// insert non-breaking space char via unicode
		var textNode = document.createTextNode( "\u00a0" );
		cursor.parentNode.insertBefore( textNode, cursor );
		evt.preventDefault();
	}

	// printable character insertion
	else {
		var text = this.convertCharcode( code );
		Richie.trace( 'inserting text ' + text );
		var textNode = document.createTextNode( text );
		cursor.parentNode.insertBefore( textNode, cursor );
	}

	if( Richie.isMobile ) {
		this.repositionInputBox();
	}
	this.m_editor.normalize();
}

/**
* handler for key events that don't provide charCode, or for actions
* that don't require them. 
*/
Richie.prototype.handleKeydown = function( evt ) {
	Richie.trace( 'KeyDown - Key: ' + evt.keyCode + ' ' + 'Char: ' + evt.charCode );
	var cursor = this.m_cursor;
	
	this.backspaceKey( evt );	

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

	// navigation
	// should work on mobile devices that support arrow keys, iphone does not.
	else if( evt.keyCode == 37 ) { // left arrow

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
	// right arrow
	else if( evt.keyCode == 39 ) { 	
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

	// TODO: how to find correct position when traversing up 
	// and down. currently we just go to end of line	
	else if( evt.keyCode == 38 ) { // up arrow
		var previousParagraph = cursor.parentNode.previousSibling;
		previousParagraph.appendChild( cursor );
		// not sure if we really need preventdefault with arrow keys
		evt.preventDefault();
	}
	else if( evt.keyCode == 40 ) { // down arrow
		var previousParagraph = cursor.parentNode.nextSibling;
		previousParagraph.appendChild( cursor );
		// not sure if we really need preventdefault with arrow keys
		evt.preventDefault();
	}

	// keyboard shortcuts for toggling styles
	// carryover from pc browser version.
	else if ( evt.keyCode == 66 && evt.ctrlKey == true ) {
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

	if( Richie.isMobile ) {
		this.repositionInputBox();
	}
	this.m_editor.normalize();
}


/**
* Clickhandler handles positioning the cursor when randomly
* accessing via click in the body of the text.
*/
Richie.prototype.clickHandler = function( ev ) {
	Richie.trace( "clickhandler fired" );
	if( Richie.isMobile ) {
		this.m_keyboardInput.focus();
	}
	
	// TODO: clickhandler puts point at beginning of element
	// without taking into account character offset	
	// var node = window.getSelection().focusNode;
	var node = ev.target || ev.srcElement;

	// check to see if we have clicked in the editor itself rather
	// than in the content. If we click in the editor we want to 
	// navigate down to the content before placing the cursor
	if( node.className == 'editor' ) {
		node = node.firstChild.firstChild.firstChild;
	}
	else {
		node.parentNode.insertBefore( this.m_cursor, node );
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

/**
* get contents of editor for posting/saving
*/
Richie.prototype.getText = function() {
	// ugly way to remove the cursor from exported data
	// TODO: should change this to use DOM methods at least.
	var text = this.m_content.innerHTML.replace( /<span class="cursor".*?<\/span>/, '' )
		// second pattern is for Firefox, note that the cursor can be 
		// hidden or visible, so that affects what we do here.
		.replace( /<span style="visibility: (hidden|visible);" class="cursor".*?<\/span>/, '' );
	return text;
}

/**
* load editor with html content
*/
Richie.prototype.loadText = function( text ) {
	this.m_content.innerHTML = text;
	this.insertCursor();
}

/**
* puts the cursor at the beginning of the document
* call after loading file, for example.
*/
Richie.prototype.insertCursor = function() {
	var cursor = document.createElement( "span" );
	this.m_cursor = cursor;
	cursor.className = "cursor";
	if( !Richie.isMobile ) {
		cursor.innerHTML = "|";
	}
	this.m_content.firstChild.insertBefore( cursor, this.m_content.firstChild.firstChild );
}

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

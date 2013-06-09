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
* main handler for events that need charCode 
* (printable chars and nonbreaking space)
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
	this.leftArrow( evt );
	this.rightArrow( evt );
	this.upArrow( evt );
	this.downArrow( evt );
	this.tabKey( evt );

	this.doStyling( evt );


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


# About

Richie is a Javascript rich text editor for both mobile and desktop browsers.
It uses the HTML DOM directly and does not rely on contenteditable or designmode.

# Status

Richie is under development. Radical changes to the code are expected.
Don't rely on this current development version.

# Background and theory of operation

As mobile devices grow in capability, the desire to access rich internet 
applications written in HTML/Javascript is also growing. However despite 
the growth in capability of these devices there are still some notable 
deficiencies. One of these is a lack of the traditional editing mechanisms 
(designmode and contenteditable) used by current browser-based rich text
editors such as TinyMCE and others.

Mobile devices such as the iPhone typically accept keyboard input only 
when a valid input control has focus on the page. In order to use an 
editor that relies on intercepting keyboard input, we have to fool the 
device into thinking that an input control is selected and waiting for 
input. In the case of the iPhone, the onscreen keyboard doesn't display 
at all unless an input control is selected.

The second problem is that if we put an input control on the page somewhere to 
serve as the input target, the page will automatically scroll back to the input 
control regardless of where we redirect the text on the page. This means that
we have to move the input control around to match where the user is expecting
to see the insertion.

Richie renders text by handling keyboard input and manually inserting the characters into a
section of the DOM, mimicking the behavior that is presented by an HTML document with 
designmode equal to 'on' or an HTML element whose contenteditable is set to true.

The text box movement is achieved using absolute positioning. The box is moved 
around the page as the cursor is moved. This allows focus to be maintained
as the control is never removed from the DOM in order to change position.

# Testing strategies

Manipulating the DOM one keystroke at a time can be particularly error-prone
and subject to differences between browsers. Coupled with the desire to
support many mobile browsers including the iPhone makes it vital to 
be able to check for regressions quickly and easily. I'm proposing
the use of Selenium, which now supports the iPhone via a UIWebKitView
as well as most desktop browsers.

# Limitations

 * Buggy 
 * No copy and paste

# Bugs 

 * Backspace cannot cross a node boundary, so removing bold text and then plain text is not currently possible, nor is it possible to cross a newline boundary.
 * The cursor position does not update
when a newline is entered. The next character entered causes the cursor to jump. 
 * Text wrapping does not occur at the end of the editor element. The cursor will wrap but 
text continues to be inserted at the end of the previous line.
 * There is no way to randomly access a text selection using a touch gesture.

# Future work

The current design manipulates the browser's DOM directly. I'm toying with 
the thought of using a back buffer instead, and decoupling the data from the
DOM entirely. This represents another layer of design complexity, so I think
I'm going to pursue the simpler direct-DOM approach until it becomes apparent
that managing the DOM on different devices will indeed become too unwieldy.

Most of the near term work will be focused on testing and fixing quirks
with the existing code. Features such as clicking to select are basically
broken right now. Copy and paste does not exist at all yet.

# License
Richie is provided under the MIT free software license. See LICENSE file for 
the full text. Copyright 2010 [Dan Newcome](http://newcome.wordpress.com/).




# About

Richie is a Javascript rich text editor for the iPhone. It uses the HTML DOM but does not rely on contenteditable or designmode.

# Status

This iPhone-specific implementation of Richie grew out of a previous desktop browser implementation that was extended with input-handling techniques in order to work on the iPhone. I'm not very familiar with how Safari Mobile handles DOM operations, so there are some strange behaviors that I have not figured out how to fix yet. Suggestions are welcome for any of the TODO: items listed in the code.

# Background and theory of operation

As mobile devices grow in capability, the desire to access rich internet applications written in HTML/Javascript is also growing. However despite the growth in capability of these devices there are still some notable deficiencies. One of these is a lack of the traditional editing mechanisms (designmode and contenteditable) used by current browser-based rich text editors such as TinyMCE and others.

Mobile devices such as the iPhone typically accept keyboard input only when a valid input control has focus on the page. In order to use an editor that relies on intercepting keyboard input, we have to fool the device into thinking that an input control is selected and waiting for input. In the case of the iPhone, the onscreen keyboard doesn't display at all unless an input control is selected.

The second problem is that if we put an input control on the page somewhere to serve as the input target, the page will automatically scroll back to the input control regardless of where we redirect the text on the page. This means that we have to move the input control around to match where the user is expecting to see the insertion.

Richie renders text by handling keyboard input and manually inserting the characters into a
section of the DOM, mimicking the behavior that is presented by an HTML document with 
designmode equal to 'on' or an HTML element whose contenteditable is set to true.

The text box movement is achieved using absolute positioning. The box is moved around the page as the cursor is moved. This allows focus to be maintained as the control is never removed from
the DOM in order to change position.

# Limitations

The current implementation is quirky and supports a very limited range of styling options. Known limitations with the iPhone version are:

 * Backspace removes two characters initially due to an inconsistency in the way Safari reports text node lengths. 
 * Backspace cannot cross a node boundary, so removing bold text and then plain text is not currently possible, nor is it possible to cross a newline boundary.
 * The cursor position does not update
when a newline is entered. The next character entered causes the cursor to jump. 
 * Text wrapping does not occur at the end of the editor element. The cursor will wrap but 
text continues to be inserted at the end of the previous line.
 * There is no way to randomly access a text selection using a touch gesture.

# Future work

Richie currently exists as a demo page only. It should be wrapped up in a way such that it 
can be included easily in another application. Conceptually, Richie should work in many different mobile browsers as well as desktop browsers. I have done some limited testing
on the Palm Pre and found that the same concepts presented here also apply. Universal
browser detection and support would make Richie very useful for applications that need
to support simple text styling on a wide variety of browser platforms.

# License
Richie is provided under the MIT free software license. See LICENSE file for 
the full text. Copyright 2010 [Dan Newcome](http://newcome.wordpress.com/).




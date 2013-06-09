// package com.example.tests;

import com.thoughtworks.selenium.Selenium;
import com.thoughtworks.selenium.SeleneseTestCase;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverBackedSelenium;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import java.util.regex.Pattern;

public class linebreak extends SeleneseTestCase {
	@Before
	public void setUp() throws Exception {
		WebDriver driver = new FirefoxDriver();
		String baseUrl = "file:///home/dan/Desktop/sandbox/richie/test.html";
		selenium = new WebDriverBackedSelenium(driver, baseUrl);
	}

	@Test
	public void testLinebreak() throws Exception {
		selenium.open("file:///home/dan/Desktop/sandbox/richie/test.html");
		selenium.click("id=editor44");
		selenium.keyPress("id=editor44", "o");
		selenium.keyPress("id=editor44", "n");
		selenium.keyPress("id=editor44", "e");
		selenium.typeKeys("id=editor44", "\\13");
		selenium.keyPress("id=editor44", "t");
		selenium.keyPress("id=editor44", "w");
		selenium.keyPress("id=editor44", "o");
		selenium.keyPress("id=editor44", "\\13");
		assertEquals("<p>one</p><p>two</p><p></p>", selenium.getEval("this.browserbot.getCurrentWindow().richie.getText()"));
	}

	@After
	public void tearDown() throws Exception {
		selenium.stop();
	}
}

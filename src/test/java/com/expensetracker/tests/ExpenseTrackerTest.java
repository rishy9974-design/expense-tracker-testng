package com.expensetracker.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.Select;
import org.testng.Assert;
import org.testng.annotations.*;

public class ExpenseTrackerTest {
    private WebDriver driver;

    @BeforeClass
    @Parameters({"appUrl"})
    public void setUp(@Optional("http://localhost:8080/index.html") String appUrl) {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        driver = new ChromeDriver(options);
        driver.get(appUrl);
    }

    @DataProvider(name = "expenseData")
    public Object[][] provideExpenseData() {
        return new Object[][] {
            {"Cloud Server Lab Pass", "Academic", "500", "2026-10-22", "AWS student lab credits"}
        };
    }

    @Test(priority = 1, description = "Verify page title and initial expense count")
    public void testInitialExpenseSummary() {
        Assert.assertTrue(driver.getTitle().contains("ExpenseTracker"));
        String summary = driver.findElement(By.id("summary")).getText();
        Assert.assertEquals(summary, "4 of 4 expenses shown");
    }

    @Test(priority = 2, dataProvider = "expenseData", description = "Verify adding a new expense")
    public void testAddExpense(String title, String category, String amount, String date, String notes) {
        driver.findElement(By.id("title")).sendKeys(title);
        new Select(driver.findElement(By.id("category"))).selectByVisibleText(category);
        driver.findElement(By.id("amount")).clear();
        driver.findElement(By.id("amount")).sendKeys(amount);
        driver.findElement(By.id("date")).sendKeys(date);
        driver.findElement(By.id("notes")).sendKeys(notes);
        driver.findElement(By.id("saveBtn")).click();

        String totalText = driver.findElement(By.id("totalAmount")).getText();
        Assert.assertEquals(totalText, "Total: Rs. 3150");
    }

    @Test(priority = 3, description = "Verify filtering expenses by category")
    public void testFilterByCategory() {
        driver.findElement(By.xpath("//button[text()='Food']")).click();
        String summary = driver.findElement(By.id("summary")).getText();
        Assert.assertEquals(summary, "1 of 5 expenses shown");
    }

    @Test(priority = 4, description = "Verify searching expenses by keyword")
    public void testSearchExpense() {
        driver.findElement(By.xpath("//button[text()='All']")).click();
        driver.findElement(By.id("search")).sendKeys("Broadband");
        String totalText = driver.findElement(By.id("totalAmount")).getText();
        Assert.assertEquals(totalText, "Total: Rs. 750");
    }

    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}

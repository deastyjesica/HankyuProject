const {By, Key, Builder, until} = require('selenium-webdriver');
require('chromedriver');
const createDriver = require('./driver');
const assert = require('assert');
const fs = require('fs');

let credentials;
    try {
        const data = fs.readFileSync('credentials.json', 'utf8');
        credentials = JSON.parse(data);
    } catch (error) {
        console.error('Error reading credentials file:', error);
        process.exit(1); 
    }

describe('E2E UPBOND HANKYU VIP STG', function(){
    this.timeout(200000);
    let driver;
    before(async function(){
        driver = await createDriver();
    });
    after(async function () {
        await driver.quit();
    });
    it('01. Login Existing User & Check Dashboard', async function(){
        const chai = await import('chai');
        chai.should();
        let driver = await createDriver();
    
        // try {
            await driver.get('https://stg.vip.hankyu-hanshin-dept.co.jp/?member_no=714-1-076315&rank=silver&signature=2f1b434ec7068bb6e61aabace524b65dbf9c68f56a22c677627b99b84b90943a');
            await driver.manage().window().maximize();
            
            await driver.wait(until.elementLocated(By.xpath('//span[@id="otp-btn" and contains(text(),"Login with Email")]')), 5000);
            await driver.findElement(By.xpath('//span[@id="otp-btn" and contains(text(),"Login with Email")]')).click();
            
            // Login with OTP Email
            await driver.wait(until.elementLocated(By.xpath('//span[@id="otp-btn" and contains(text(),"Login with Email")]')), 10000);
            await driver.wait(until.elementLocated(By.xpath('//input[@type="text" and @id="otp-email"]')), 5000);
            await driver.findElement(By.xpath('//input[@type="text" and @id="otp-email"]')).sendKeys(credentials.USROTP_VIP_NEW);
            await driver.findElement(By.xpath('//button[@type="submit" and @id="otp-button"]')).click();
            await driver.sleep(3000)

            // Switch new tab to get OTP code
            let current_window = await driver.getWindowHandle();
            await driver.switchTo().newWindow('tab');
            let windows = await driver.getAllWindowHandles();
            let tab;
            windows.forEach(async handle =>{
                if (handle!=current_window){
                    tab = handle;
                }
            });
            await driver.get('https://mail.google.com/');
            await driver.manage().window().maximize();
            await driver.findElement(By.xpath('//input[@type="email" and @name="identifier"]')).sendKeys(credentials.USRGOOGLE);
            await driver.sleep(1000);
            await driver.findElement(By.xpath('//span[text()="Next"]')).click();
            await driver.sleep(2500);
            await driver.wait(until.elementLocated(By.xpath('//input[@type="password" and @name="Passwd"]')), 1200);
            //await driver.wait(until.elementLocated(mail.passwdField), 1000);
            await driver.findElement(By.xpath('//input[@type="password" and @name="Passwd"]')).sendKeys(credentials.PWDOTP);
            await driver.sleep(5000);
            await driver.findElement(By.xpath('//span[text()="Next"]')).click();
            await driver.sleep(9000);
            await driver.wait(until.elementLocated(By.xpath('(//a[@title="Gmail" and @href="#inbox"])[2]')), 5000);
            await driver.sleep(5000);
            // elemen baris pertama di kotak masuk
            //let topEmail = await driver.wait(until.elementLocated(By.xpath('(//table[@role="grid"])[1]//tr[1]')), 5000);
            let topEmail = await driver.wait(until.elementLocated(By.css('tr.zA.zE')), 3000);
            await topEmail.click();
            // let replyBtn = await driver.findElement(mail.replyBtn);
            // await driver.executeScript("arguments[0].scrollIntoView(true);", replyBtn);

            // Fetch the OTP directly before entering it
            // let otpElement = await driver.wait(until.elementLocated(By.xpath('(//p)[3]')), 5000);
            // let otpCode = await otpElement.getText();

            // let otpElement = await driver.findElement(By.xpath('(//div/div/span)[137]'));
            // let otpCode = await otpElement.getText();
            let otpElement = await driver.findElement(By.xpath('(//p)[3]'));
            let otpCode = await otpElement.getText();

            //Back to login 3.0 page
            await driver.getAllWindowHandles();
            await driver.switchTo().window(current_window);
            for (let i = 0; i < otpCode.length; i++) {

                let inputElement = await driver.wait(until.elementLocated(By.id(`handleInput${i + 1}`)), 3000);
                await inputElement.sendKeys(otpCode[i]);
                await driver.sleep(500);
            };
            await driver.sleep(1000);
            await driver.findElement(By.xpath('//button[@type="submit"]')).click();
            await driver.sleep(20000);

            // check privacy policy agreement
            await driver.sleep(10000);
            await driver.wait(until.elementLocated(By.xpath('//input[@id="privacy_policy_agreement" and @type="checkbox"]')), 1000);
            // click next
            await driver.findElement(By.xpath('//button[@class="agree-consent mx-auto"]')).click();
            // homepage hankyu
            await driver.sleep(1000);
            await driver.findElement(By.xpath('//input[@id="myCheckbox"]')).click();
            await driver.findElement(By.xpath('//input[@placeholder="First name"]')).sendKeys('Deasty');
            await driver.findElement(By.xpath('//input[@placeholder="Middle name (optional)"]')).sendKeys('vi');
            await driver.findElement(By.xpath('//input[@placeholder="Last name"]')).sendKeys('Jesica');
            await driver.findElement(By.xpath('(//select[@name="date"])[1]')).sendKeys('10');
            await driver.findElement(By.xpath('(//select[@name="date"])[2]')).sendKeys('12');
            await driver.findElement(By.xpath('(//select[@name="date"])[3]')).sendKeys('1999');
            await driver.findElement(By.xpath('//input[@id="newsletter"]')).click();
            await driver.findElement(By.xpath('//div[text()="new member"]')).click();
            await driver.wait(until.elementLocated(By.xpath('//div[@class="text-sm leading-5" and contains(text(),"Overseas Customer’s VIP Club Introduction to Services Offered")]')), 5000);
            
            await driver.sleep(1000);
            await driver.quit();
        // } catch (error) {
        //     console.error('Error occurred during test execution:', error);
        //     throw new Error('Failed to login existing user with OTP');
        // }

        // await driver.sleep(500);
        // await driver.quit();
    });
});
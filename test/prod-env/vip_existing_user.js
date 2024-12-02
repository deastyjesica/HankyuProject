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

describe('E2E UPBOND HANKYU VIP PROD', function(){
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
            await driver.get('https://vip.hankyu-hanshin-dept.co.jp/');
            await driver.manage().window().maximize();
            
            //await driver.wait(until.elementLocated(By.xpath('//span[@id="otp-btn" and contains(text(),"Login with Email")]')), 5000);
            await driver.wait(until.elementLocated(By.xpath('//span[@id="otp-btn" and contains(text(),"メールアドレスでログイン")]')), 5000);
            await driver.findElement(By.xpath('//span[@id="otp-btn" and contains(text(),"メールアドレスでログイン")]')).click();
            
            // Login with OTP Email
            await driver.wait(until.elementLocated(By.xpath('//span[@id="otp-btn" and contains(text(),"メールアドレスでログイン")]')), 10000);
            await driver.wait(until.elementLocated(By.xpath('//input[@type="text" and @id="otp-email"]')), 5000);
            await driver.findElement(By.xpath('//input[@type="text" and @id="otp-email"]')).sendKeys(credentials.USROTP_VIP_EXISTING);
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
            await driver.sleep(1500);
            await driver.findElement(By.xpath('//span[text()="Next"]')).click();
            await driver.sleep(5000);
            await driver.wait(until.elementLocated(By.xpath('//input[@type="password" and @name="Passwd"]')), 1000);
            await driver.findElement(By.xpath('//input[@type="password" and @name="Passwd"]')).sendKeys(credentials.PWDOTP);
            await driver.sleep(1000);
            await driver.findElement(By.xpath('//span[text()="Next"]')).click();
            await driver.sleep(5000);
            await driver.wait(until.elementLocated(By.xpath('(//a[@title="Gmail" and @href="#inbox"])[2]')), 5000);
            let topEmail = await driver.wait(until.elementLocated(By.css('tr.zA.zE')), 3000);
            await topEmail.click();
            let otpElement = await driver.findElement(By.xpath('(//p)[3]'));
            let otpCode = await otpElement.getText();

            //Back to login 3.0 page
            await driver.getAllWindowHandles();
            await driver.switchTo().window(current_window);
            for (let i = 0; i < otpCode.length; i++) {

                let inputElement = await driver.wait(until.elementLocated(By.id(`handleInput${i + 1}`)), 3000);
                await inputElement.sendKeys(otpCode[i]);
                await driver.sleep(1000);
            };
            await driver.sleep(1000);
            await driver.findElement(By.xpath('//button[@type="submit"]')).click();
            await driver.sleep(20000);

            // Home page Hankyu VIP
            await driver.wait(until.elementLocated(By.xpath('//div[text()="■ Member Privileges"]')), 8000);
            await driver.sleep(500);
            await driver.quit();
        // } catch (error) {
        //     console.error('Error occurred during test execution:', error);
        //     throw new Error('Failed to login existing user with OTP');
        // }

    });

    it('02. Login Existing User Hankyu Restaurant', async function(){
        const chai = await import('chai');
        chai.should();
        let driver = await createDriver();
    
        // try {
            await driver.get('https://vip-conciergeservice.hankyu-hanshin-dept.co.jp/');
            await driver.manage().window().maximize();

            await driver.findElement(By.xpath('//button[text()="Login"]')).click();
            await driver.findElement(By.xpath('//span[@id="otp-btn" and contains(text(),"メールアドレスでログイン")]')).click();
            
            // Login with OTP Email
            //await driver.wait(until.elementLocated(By.xpath('//span[@id="otp-btn" and contains(text(),"メールアドレスでログイン")]')), 10000);
            await driver.wait(until.elementLocated(By.xpath('//input[@type="text" and @id="otp-email"]')), 5000);
            await driver.findElement(By.xpath('//input[@type="text" and @id="otp-email"]')).sendKeys(credentials.USROTP_VIP_EXISTING);
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
            await driver.sleep(1500);
            await driver.findElement(By.xpath('//span[text()="Next"]')).click();
            await driver.sleep(5000);
            await driver.wait(until.elementLocated(By.xpath('//input[@type="password" and @name="Passwd"]')), 1000);
            await driver.findElement(By.xpath('//input[@type="password" and @name="Passwd"]')).sendKeys(credentials.PWDOTP);
            await driver.sleep(1000);
            await driver.findElement(By.xpath('//span[text()="Next"]')).click();
            await driver.sleep(5000);
            await driver.wait(until.elementLocated(By.xpath('(//a[@title="Gmail" and @href="#inbox"])[2]')), 5000);
            let topEmail = await driver.wait(until.elementLocated(By.css('tr.zA.zE')), 3000);
            await topEmail.click();
            let otpElement = await driver.findElement(By.xpath('(//p)[3]'));
            let otpCode = await otpElement.getText();

            //Back to login 3.0 page
            await driver.getAllWindowHandles();
            await driver.switchTo().window(current_window);
            for (let i = 0; i < otpCode.length; i++) {

                let inputElement = await driver.wait(until.elementLocated(By.id(`handleInput${i + 1}`)), 3000);
                await inputElement.sendKeys(otpCode[i]);
                await driver.sleep(1000);
            };
            await driver.sleep(1000);
            await driver.findElement(By.xpath('//button[@type="submit"]')).click();
            await driver.sleep(20000);

            // Home page Hankyu Resto
            await driver.wait(until.elementLocated(By.xpath('//h1[text()="VIP Concierge Service"]')), 8000);
            await driver.sleep(500);
            await driver.quit();
        // } catch (error) {
        //     console.error('Error occurred during test execution:', error);
        //     throw new Error('Failed to login existing user with OTP');
        // }

    });
});
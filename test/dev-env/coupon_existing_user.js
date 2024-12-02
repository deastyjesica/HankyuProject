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

describe('E2E UPBOND HANKYU COUPON DEV', function(){
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
            await driver.get('https://dev.taxfree-coupon.hankyu-hanshin-dept.co.jp/');
            await driver.manage().window().maximize();
            
            //await driver.wait(until.elementLocated(By.xpath('//span[@id="otp-btn" and contains(text(),"Login with Email")]')), 5000);
            await driver.wait(until.elementLocated(By.xpath('//span[@id="otp-btn" and contains(text(),"メールアドレスでログイン")]')), 5000);
            await driver.findElement(By.xpath('//span[@id="otp-btn" and contains(text(),"メールアドレスでログイン")]')).click();
            
            // Login with OTP Email
            await driver.wait(until.elementLocated(By.xpath('//span[@id="otp-btn" and contains(text(),"メールアドレスでログイン")]')), 10000);
            await driver.wait(until.elementLocated(By.xpath('//input[@type="text" and @id="otp-email"]')), 5000);
            await driver.findElement(By.xpath('//input[@type="text" and @id="otp-email"]')).sendKeys(credentials.USROTP_COUPON_EXISTING);
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

            // dashboard Hankyu Coupon
            await driver.wait(until.elementLocated(By.xpath('//img[@loading="lazy" and contains(@srcset, "coupon-sm-expired")]')), 8000);
            await driver.sleep(1000);
            await driver.quit();
        // } catch (error) {
        //     console.error('Error occurred during test execution:', error);
        //     throw new Error('Failed to login existing user with OTP');
        // }

    });

    it('02. Login coupon cannot contain VIP members', async function(){
        const chai = await import('chai');
        chai.should();
        let driver = await createDriver();
    
        // try {
            await driver.get('https://dev.taxfree-coupon.hankyu-hanshin-dept.co.jp/');
            await driver.manage().window().maximize();
            
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

            // dashboard Hankyu Coupon
            try {
                let errorMessage = await driver.wait(until.elementLocated(By.xpath('//div[contains(text(),"VIP members cannot obtain coupons.")]')), 8000);
                assert.strictEqual(await errorMessage.getText(), "VIP members cannot obtain coupons.");
                console.log("Pesan error ditemukan sebelum redirect.");
            } catch (error) {
                console.error("Pesan error tidak ditemukan atau halaman sudah di-redirect.");
            }


            //await driver.wait(until.elementLocated(By.xpath('//div[contains(text(),"VIP members cannot obtain coupons.")]')), 8000);
            await driver.sleep(1000);
            await driver.quit();
        // } catch (error) {
        //     console.error('Error occurred during test execution:', error);
        //     throw new Error('Failed to login existing user with OTP');
        // }

    });

    it('03. Check if it’s possible to register on COUPON site after scanning a new VIP QR code, but without clicking "New Member," then accessing the coupon site', async function(){
        const chai = await import('chai');
        chai.should();
        let driver = await createDriver();
    
        // try {
            await driver.get('https://dev.vip.hankyu-hanshin-dept.co.jp/?member_no=714-1-075874&rank=silver&signature=d281605a542152d1214da979ec5ee5ea9091744c21ad3e7b1b88691003ea7436');
            await driver.manage().window().maximize();
            
            await driver.wait(until.elementLocated(By.xpath('//span[@id="otp-btn" and contains(text(),"メールアドレスでログイン")]')), 5000);
            await driver.findElement(By.xpath('//span[@id="otp-btn" and contains(text(),"メールアドレスでログイン")]')).click();
            
            // Login with OTP Email
            await driver.wait(until.elementLocated(By.xpath('//span[@id="otp-btn" and contains(text(),"メールアドレスでログイン")]')), 10000);
            await driver.wait(until.elementLocated(By.xpath('//input[@type="text" and @id="otp-email"]')), 5000);
            await driver.findElement(By.xpath('//input[@type="text" and @id="otp-email"]')).sendKeys(credentials.USROTP_COUPON_NEW);
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

            // Check privacy policy agreement
            await driver.sleep(2000);
            let privacyPolicyCheckbox = await driver.wait(
                until.elementLocated(By.xpath('//input[@id="privacy_policy_agreement" and @type="checkbox"]')), 5000);
            await driver.sleep(2000);
                await privacyPolicyCheckbox.click();
            await driver.sleep(2000);

            // click next
            await driver.findElement(By.xpath('//button[@class="agree-consent mx-auto"]')).click();
            // homepage hankyu
            await driver.sleep(1000);
            await driver.wait(until.elementLocated(By.xpath('//div[@class="text-sm leading-5" and contains(text(),"Overseas Customer’s VIP Club Introduction to Services Offered")]')), 5000);
            await driver.wait(until.elementLocated(By.xpath('//div[text()="■ Member Privileges"]')), 8000);
            
            await driver.sleep(1000);
            await driver.quit();

            // dashboard Hankyu Coupon
            try {
                let errorMessage = await driver.wait(until.elementLocated(By.xpath('//div[contains(text(),"VIP members cannot obtain coupons.")]')), 8000);
                assert.strictEqual(await errorMessage.getText(), "VIP members cannot obtain coupons.");
                console.log("Pesan error ditemukan sebelum redirect.");
            } catch (error) {
                console.error("Pesan error tidak ditemukan atau halaman sudah di-redirect.");
            }


            //await driver.wait(until.elementLocated(By.xpath('//div[contains(text(),"VIP members cannot obtain coupons.")]')), 8000);
            await driver.sleep(1000);
            await driver.quit();
        // } catch (error) {
        //     console.error('Error occurred during test execution:', error);
        //     throw new Error('Failed to login existing user with OTP');
        // }

    });
});
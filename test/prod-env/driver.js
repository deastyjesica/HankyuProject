const { Builder, Capabilities } = require('selenium-webdriver');
require('chromedriver');

async function createDriver() {
    let chromeCapabilities = Capabilities.chrome();
    let chromeOptions = {
        'args': [
            '--disable-web-security',
            '--allow-insecure-localhost',
            '--ignore-certificate-errors',
            '--disable-site-isolation-trials',
            '--disable-gpu',
            '--no-sandbox'
        ]
    };
    chromeCapabilities.set('goog:chromeOptions', chromeOptions);

    return new Builder().withCapabilities(chromeCapabilities).forBrowser('chrome').build();
}

module.exports = createDriver;
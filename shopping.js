const fs = require('fs')
const puppeteer = require('puppeteer')
const lighthouse = require('lighthouse/lighthouse-core/fraggle-rock/api.js')

function getFormattedDate(date) {
	const year = date.getFullYear();
	const month = (`0${date.getMonth() + 1}`).slice(-2);
	const day = (`0${date.getDate()}`).slice(-2);
	const hours = (`0${date.getHours()}`).slice(-2);
	const minutes = (`0${date.getMinutes()}`).slice(-2);
	const seconds = (`0${date.getSeconds()}`).slice(-2);
  
	const dateFormat = `${year}${month}${day}_${hours}${minutes}${seconds}`;
  
	return dateFormat;
  }

async function captureReport() {
	const browser = await puppeteer.launch({"headless": 'new', args: ['--allow-no-sandbox-job', '--allow-sandbox-debugging', '--no-sandbox', '--disable-gpu', '--disable-gpu-sandbox', '--display', '--ignore-certificate-errors', '--disable-storage-reset=true']});
	// const browser = await puppeteer.launch({"headless": false, args: ['--allow-no-sandbox-job', '--allow-sandbox-debugging', '--no-sandbox', '--ignore-certificate-errors', '--disable-storage-reset=true']});
	const page = await browser.newPage();
	const baseURL = "http://localhost/";
	
	await page.setViewport({"width":1920,"height":1080});
	await page.setDefaultTimeout(10000);
	
	const navigationPromise = page.waitForNavigation({timeout: 30000, waitUntil: ['domcontentloaded']});
	await page.goto(baseURL);
    await navigationPromise;
		
	const flow = await lighthouse.startFlow(page, {
		name: 'shopping-performance testing task',
		configContext: {
		  settingsOverrides: {
			throttling: {
			  rttMs: 40,
			  throughputKbps: 10240,
			  cpuSlowdownMultiplier: 1,
			  requestLatencyMs: 0,
			  downloadThroughputKbps: 0,
			  uploadThroughputKbps: 0
			},
			throttlingMethod: "simulate",
			screenEmulation: {
			  mobile: false,
			  width: 1920,
			  height: 1080,
			  deviceScaleFactor: 1,
			  disabled: false,
			},
			formFactor: "desktop",
			onlyCategories: ['performance'],
		  },
		},
	});

  	//================================NAVIGATE================================
    await flow.navigate(baseURL, {
		stepName: 'open the application'
		});
  	console.log('application is opened');
	
	//================================TEST DATA================================
	const name 		= "John";
	const address 	= "Baker Street No.1";
	const postal 	= "386092";
	const city 		= "New City";
	const country 	= "AF";
	const phone 	= "123-456-789";
	const email 	= "john@gmail.com";

	//================================SELECTORS================================
	const tablesTab 			= "a[href='http://localhost/tables']";
	const livingRoomTable8 		= "a[href='http://localhost/products/living-room-table8']";
	const addToCartButton 		= "button[type='submit']";
	const addedCartSuccess 		= "span[class='al-box success cart-added-info ']";
	const cartTab				= "li[class='page_item page-item-31'] a[href='http://localhost/cart']";
	const placeAnOrderButton 	= "input[value='Place an order']";
	const placeOrderButton 		= "input[value='Place Order']";
	const cartName 				= "input[name='cart_name']";
	const cartAddress 			= "input[name='cart_address']";
	const cartPostal 			= "input[name='cart_postal']";
	const cartCity 				= "input[name='cart_city']";
	const cartCountry 			= "select[name='cart_country']";
	const cartPhone 			= "input[name='cart_phone']";
	const cartEmail 			= "input[name='cart_email']";
	const thankyouTitle			= "h1[class='entry-title']";

	//================================PAGE_ACTIONS================================
	await page.waitForSelector(tablesTab);
	await flow.startTimespan({ stepName: 'Navigate to "Tables" tab' });
		await page.click(tablesTab);
		await page.waitForSelector(livingRoomTable8);
    await flow.endTimespan();
    console.log('"Tables" tab navigation is completed');

	await flow.startTimespan({ stepName: 'Open a table product cart' });
		await page.click(livingRoomTable8);
		await page.waitForSelector(addToCartButton);
	await flow.endTimespan();
	console.log('a table product cart is opened');

	await flow.startTimespan({ stepName: 'Add table to Cart' });
		await page.click(addToCartButton);
		await page.waitForSelector(addedCartSuccess);
	await flow.endTimespan();
	console.log('the table product cart is added to cart');

	await flow.startTimespan({ stepName: 'Open Cart' });
		await page.click(cartTab);
		await page.waitForSelector(placeAnOrderButton);
	await flow.endTimespan();
	console.log('"Cart" tab navigation is completed');

	await flow.startTimespan({ stepName: 'Click "Place an order"' });
		await page.click(placeAnOrderButton);
		await page.waitForSelector(cartName);
	await flow.endTimespan();
	console.log('"Place an order" is completed');

	await flow.startTimespan({ stepName: 'Fill in all required fields, click "Place order"' });
		await page.type(cartName, name);
		await page.waitForSelector(cartAddress);
		await page.type(cartAddress, address);
		await page.waitForSelector(cartPostal);
		await page.type(cartPostal, postal);
		await page.waitForSelector(cartCity);
		await page.type(cartCity, city);
		await page.waitForSelector(cartCountry);
		await page.select(cartCountry, country);
		await page.waitForSelector(cartPhone);
		await page.type(cartPhone, phone);
		await page.waitForSelector(cartEmail);
		await page.type(cartEmail, email);
		await page.waitForSelector(placeOrderButton);
		await page.click(placeOrderButton);
		await page.waitForSelector(thankyouTitle);
	await flow.endTimespan();
	console.log('Filling in all required fields, clicking on "Place order" is completed');

	//================================REPORTING================================
	const currentTime = new Date();

	const reportName = `/user-flow_report_${getFormattedDate(currentTime)}.html`;
	
	const reportPath = __dirname + reportName;
	//const reportPathJson = __dirname + '/user-flow.report.json';

	const report = await flow.generateReport();
	//const reportJson = JSON.stringify(flow.getFlowResult()).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
	
	fs.writeFileSync(reportPath, report);
	//fs.writeFileSync(reportPathJson, reportJson);
	
    await browser.close();
}
captureReport();
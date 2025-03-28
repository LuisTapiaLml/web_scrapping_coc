import puppeteer from 'puppeteer';
import 'dotenv/config';
import LINKS from './src/models/links.js';

(async () => {

    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    const BASE_URL = process.env.BASE_URL;

    await page.goto(`${BASE_URL}${LINKS.TABLE_TROOPS}`);

    const type_troops_table = await page.$('.wikitable.mw-collapsible.mw-made-collapsible');

    if (type_troops_table === null) {
        console.log('Element not found.');
        process.exit()

    }
    // Performing actions on the element

    const table_rows = await type_troops_table.$$("tr")

    const troops_urls = [];


    const cells = await table_rows[1].$$('td');

    if (cells.length >= 2) {

        const secondCell = cells[1];

        // Get all links in the second cell
        const links = await secondCell.$$('a');

        // Extract href attributes from all links
        const hrefs = await Promise.all(
            links.map(link => link.evaluate(a => a.getAttribute('href')))
        );

        hrefs.forEach( href =>  troops_urls.push(`${BASE_URL}${href}`))

    }
    
    for (const url of troops_urls) {


        


    }

    browser.close()

})();
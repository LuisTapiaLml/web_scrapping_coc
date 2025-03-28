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
    const troops_data = [];

    const cells = await table_rows[1].$$('td');

    if (cells.length >= 2) {

        const secondCell = cells[1];

        // Get all links in the second cell
        const links = await secondCell.$$('a');

        // Extract href attributes from all links
        const hrefs = await Promise.all(
            links.map(link => link.evaluate(a => a.getAttribute('href')))
        );

        hrefs.forEach(href => troops_urls.push(`${BASE_URL}${href}`))

    }
    console.log(troops_urls);

    let count = 1;

    for (const url of troops_urls) {

        console.log(url);

        await page.goto(url);

        const floatnone = await page.$('.floatnone');

        if (floatnone == null) {
            continue;
        }

        const image = await floatnone.$("img")
        const name = await page.$eval('.mw-page-title-main', el => el.textContent);

        if (image == null) {
            continue;
        }

        const troop_image = await image.evaluate(img => img.src);

        const levels = await getLeves(page, BASE_URL )

        const troop = {
            id: count,
            name: name,
            image: troop_image,
            niveles : levels
        }

        troops_data.push(troop)

        count++;
        break;
    }

    browser.close()


    console.log({
        troops_data
    });


})();



const getLeves = async (page , BASE_URL) => {

    const levels  = [

    ]

    try {
        const card_levels = await page.$(".portable-infobox.noexcerpt.pi-background.pi-theme-Elixir.pi-layout-stacked");
        const images_container = await card_levels.$$(".pi-media-collection-tab-content");

        for (const image_container of images_container) {
            
            const elImages = await image_container.$('img');

            const image_link = await elImages.evaluate(img => img.src);

         
            let title = await image_container.$eval('.image.image-thumbnail', el => el.getAttribute('title'));
            
            title = title.replace("&","").replace("Nivel","")
            console.log(title);
            
            levels.push({
                imagen : `${BASE_URL}${image_link}`,
                niveles : title.split(" ")
            })

        }

        return levels

    } catch (error) {
        console.error(error);
        
        return levels
    }

}


const getStatistics = async (page) => {

    const statistics = {
        objetivo_preferido : null,
        tipo_dano : null,
        espacio_vivienda : null,
        velocidad_movimiento : null,
        velocidad_ataque : null,
        rango : null
    }

    try {
        
        const elTable = await page.$(".wikitable")

        


    } catch (error) {
    
        console.error(error);
        
        return statistics
        
    }

}
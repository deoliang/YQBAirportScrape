const puppeteer = require('puppeteer');
const url = 'http://www.aeroportdequebec.com/en/flights-and-destinations/flight-schedules/departures';
const tomUrl = 'http://www.aeroportdequebec.com/en/flights-and-destinations/flight-schedules/departures-tomorrow';
const $ = require('cheerio');
const fs = require('fs');
const YQBDestinations = {
    "Cities": []
}

const uniqueSet = new Set();
puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    await page.goto(url);
    let html = await page.content();
    await $('.field-content',html).each(function(i, elem) {
        if(uniqueSet.has($(this).text()))return true;
         uniqueSet.add($(this).text().trim())   
     });
    await page.goto(tomUrl);
    html = await page.content();
    await $('.field-content',html).each(function(i, elem) {
        if(uniqueSet.has($(this).text()))return true;
         uniqueSet.add($(this).text().trim())   
     });
    YQBDestinations.Cities = await [...uniqueSet].sort();
            
    await fs.writeFile('YQBDestinations.json', JSON.stringify(YQBDestinations), function(err){
        if (err) throw err;
        console.log("Successfully Written to File.");
    });
    await browser.close();
});
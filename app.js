const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://clutch.co/web-developers?agency_size=10+-+49&client_type=field_pp_cs_enterprise&industries=field_pp_if_ecommerce&related_services=field_pp_sl_ecommerce"

async function scrapeData() {
    try {
        const { data } = await axios.get(url);
        
        const $ = cheerio.load(data);
        
        const listItems = $(".company");

        const companies = [];

        listItems.each((idx, el) => {
            
            const company = { profile_page_url: "", title: "", image_url: "", website: "", description: "" };

            company.profile_page_url = $(el).children("a").attr("href");

            company.title = $(el).children("h3").text().trim();

            // company.image_url = $(el).children(".img").attr("src");

            company.image_url = $(el).find('img')[0].attribs['data-src'];
            //.find looks for all img and makes an array
            //[0] is the index selector of it
            //.attribs is object attributes raw JS
            //['data--src'] is the hidden class

            // company.website = $(el).children('.website-link__item').attrib('href');
            //company website scrape not working atm. plus the url would need to be cleaned up.

            company.description = $(el).children("p").text();

            companies.push(company);
        });

        console.dir(companies);

        fs.writeFile("companies.json", JSON.stringify(companies, null, 2), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("successfully written data to file");
        });
    } catch (err) {
        console.error(err);
    }
}

scrapeData();
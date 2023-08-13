const fetch = require('node-fetch');
const cheerio = require('cheerio');

const list = ['https://www.nitt.edu'];
const visitedUrls = new Set();

async function crawl() {
    while (list.length > 0) {
        const url = list.shift();
        if (!visitedUrls.has(url)) {
            visitedUrls.add(url);
            console.log(`Crawling: ${url}`);

            try {
                const response = await fetch(url);
                const text = await response.text();
                const adjacentUrls = extractUrls(text);


                list.push(...adjacentUrls.filter(adjUrl => !visitedUrls.has(adjUrl)));
            } catch (error) {
                console.error(`Error crawling ${url}: ${error}`);
            }
        }
    }
}

function extractUrls(html) {
    const $ = cheerio.load(html);
    const urls = [];

    $('a').each((index, element) => {
        const href = $(element).attr('href');
        if (href) {
            urls.push(href);
        }
    });

    return urls;
}


crawl();

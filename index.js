const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.use(async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.send('Please provide URL as GET parameter');
    }

    const browser = await puppeteer.launch({
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    await page.goto(url);
    // await page.waitFor(1000);
    let lances = await page.evaluate(() => window.lances);//document.head.innerHTML);

    var lancesMartinez = [];
    for (var i=0; i<lances.length; i++) {
        var l = lances[i];
        if (l.tipoLance == "NORMAL") {
           var lance = {
               tempo: l.momento, 
               periodo: l.periodoLabel,
               titulo: l.titulo,
                text: l.corpo.blocks[0].text
           };
           lancesMartinez.push(lance);
        }
    }
    browser.close();
    res.send(lancesMartinez);
});

const server = app.listen(process.env.PORT || 8080, err => {
    if (err) return console.error(err);
    const port = server.address().port;
    console.info(`App listening on port ${port}`);
});

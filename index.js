const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/generate-pdf', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('Missing URL');

    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const pdf = await page.pdf({ format: 'A4', printBackground: true });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=powerbi-report.pdf',
        });

        res.send(pdf);
    } catch (err) {
        res.status(500).send('Error generating PDF: ' + err.message);
    }
});

app.listen(process.env.PORT || 3000);

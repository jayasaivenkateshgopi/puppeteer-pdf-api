const express = require('express');
const puppeteer = require('puppeteer-core');
const app = express();
const port = process.env.PORT || 10000;

const executablePath = '/usr/bin/chromium-browser';  // Path to Chromium in Render environment

app.get('/generate-pdf', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send('Missing URL parameter');
    }

    try {
        const browser = await puppeteer.launch({
            executablePath,  // Use the correct path for Chromium
            headless: "new",  // Use the new headless mode
            args: ['--no-sandbox', '--disable-setuid-sandbox']  // Cloud-friendly flags
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });  // Wait for the page to fully load
        const pdfBuffer = await page.pdf();  // Generate PDF from the page

        await browser.close();  // Close the browser after generating PDF

        res.contentType('application/pdf');
        res.send(pdfBuffer);  // Send the PDF to the user
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating PDF: ' + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

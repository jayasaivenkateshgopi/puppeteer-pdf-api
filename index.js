const puppeteer = require('puppeteer-core');
const browserFetcher = puppeteer.createBrowserFetcher();

const executablePath = process.env.CHROME_BIN || '/usr/bin/chromium-browser';  // Path to chromium in Render environment

app.get('/generate-pdf', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('Missing URL parameter');
    }

    try {
        const browser = await puppeteer.launch({
            executablePath, // Use the chromium path from Render's environment
            headless: true, // Run headless
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Ensure Puppeteer can run on Render's environment
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        const pdfBuffer = await page.pdf();
        await browser.close();

        res.contentType("application/pdf");
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).send('Error generating PDF: ' + error.message);
    }
});

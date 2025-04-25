const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 10000;  // Use the PORT environment variable or default to 10000

app.get('/generate-pdf', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).send('Missing URL parameter');
  }

  try {
    const browser = await puppeteer.launch();
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

app.listen(port, () => {
  console.log(`Puppeteer API running on port ${port}`);
});

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(require('./routes/routes'));
 
const ScrapingService = require('./services/scrap');
const scrapingService = new ScrapingService();

setInterval(() => {
    scrapingService.updateData();
}, 2000);

app.listen(PORT, () => {
    console.log(`http://localhost:${ PORT }`);
});
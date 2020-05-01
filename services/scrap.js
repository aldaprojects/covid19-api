const request = require('request-promise');
const cheerio = require('cheerio');

const Country = require('../models/country');
const GlobalReport = require('../models/report');

const fs = require('fs');


class ScrapingService {
    constructor( ) { }

    getNewCountries() {
        return new Promise( async (resolve, reject) => {
            try {
                const countries = {};
    
                const $ = await request({
                    uri: 'https://www.worldometers.info/coronavirus/',
                    transform: body => cheerio.load(body)
                });
            
                $('#main_table_countries_today tbody tr').each( (i, elem) => {
                    const row = cheerio.load(elem);
        
                    const country_name = row('td a').html() !== null ? row('td a').text().trim() : null
                    const total_cases = row('td').next().html().trim().replace(/,/g, '');
                    const total_deaths = row('td').next().next().next().html().trim().replace(/,/g, '');
                    const total_recovered = row('td').next().next().next().next().next().html().trim().replace(/,/g, '');
        
                    if ( country_name ) {
                        const newCountry = new Country({
                            country_name,
                            total_cases: Number.parseInt(total_cases),
                            total_deaths: !total_deaths ? 0 : Number.parseInt(total_deaths),
                            total_recovered: !total_recovered ? 0 : Number.parseInt(total_recovered)
                        });
        
                        countries[country_name] = newCountry;
                    }
                    
                });
        
                console.log(Object.keys(countries).length);
        
                fs.writeFileSync('./data/countries.json', JSON.stringify(countries));

                resolve(countries);

            } catch ( err ) {
                reject(err);
            }
        });
    }

    async updateData() {

        console.log('Updating');

        let oldCountries;

        if ( fs.existsSync('./data/countries.json') ) {
            oldCountries = JSON.parse(fs.readFileSync('./data/countries.json').toString());
        } else {
            oldCountries = await this.getNewCountries();
            return;
        }
        
        const newCountries = await this.getNewCountries();

        const countriesValues = Object.values(oldCountries);

        for ( const country of countriesValues ) {
            const newCases = newCountries[country.country_name].total_cases - country.total_cases;
            const newDeaths = newCountries[country.country_name].total_deaths - country.total_deaths;
            const newRecovered = newCountries[country.country_name].total_recovered - country.total_recovered;

            if ( newCases || newDeaths || newRecovered ) {
                const newReport = new GlobalReport({
                    country_name: country.country_name,
                    newCases,
                    newDeaths,
                    newRecovered,
                    total_cases: newCountries[country.country_name].total_cases,
                    total_recovered: newCountries[country.country_name].total_recovered,
                    total_deaths: newCountries[country.country_name].total_deaths,
                    date: new Date()
                });

                console.log(newReport);

                this.saveGlobalReport( newReport );
                this.saveHistoryCountry( country, newReport );
            }
        }
    }

    saveGlobalReport( newReport ) {

        const MAX_LIMIT = 100;

        let globalReports;

        if ( fs.existsSync('./data/globalreports.json') ) {
            globalReports = JSON.parse(fs.readFileSync('./data/globalreports.json').toString());
        } else {
            globalReports = [];  
        }

        if ( globalReports.length === MAX_LIMIT ) {
            globalReports.shift();
        }

        globalReports.push(newReport);
        fs.writeFileSync('./data/globalreports.json', JSON.stringify(globalReports));
    }

    saveHistoryCountry( country, newReport ) {

        let historyCountries;
        let historyCountry;

        if ( fs.existsSync('./data/historycountries.json') ) {
            historyCountries = JSON.parse(fs.readFileSync('./data/historycountries.json').toString());
        } else {
            historyCountries = {}; 
        }

        if ( historyCountries[country.country_name] ) {
            historyCountry = historyCountries[country.country_name].history;
            const reportDate = new Date(historyCountry[ historyCountry.length - 1 ].date).getDate();

            if ( new Date().getDate() === reportDate ) {
                historyCountry.pop();
            }

            historyCountry.push( newReport );
        } else {
            historyCountry = [newReport];
        }
        historyCountries[country.country_name] = {
            country_name: country.country_name,
            history: historyCountry
        }
        fs.writeFileSync('./data/historycountries.json', JSON.stringify(historyCountries));
    }

}

module.exports = ScrapingService;
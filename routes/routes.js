const express = require('express');
const app = express();

const CountryService = require('../services/country');
const countryService = new CountryService();

app.get('/getAllCountriesName', (req, res) => {
    const countriesName = countryService.getAllCountriesName();
    return res.status(200).json({
        ok: true,
        countries: countriesName,
        total_countries: countriesName.length
    });
});

app.get('/getHistoryCountry', (req, res) => {
    const country_name = req.query.country_name;
    const history = countryService.getHistoryCountry( country_name );
    if ( history.length > 0 ) {
        return res.status(200).json({
            ok: true,
            country_name,
            history
        });
    } else {
        return res.status(404).json({
            ok: false,
            message: 'country not found'
        });
    }
});

app.get('/getGlobalReports', (req, res) => {
    const limit = req.query.limit;
    const globalReports = countryService.getGlobalReports( limit );
    return res.status(200).json({
        ok: true,
        global_repots: globalReports
    });

});

app.get('/getLastReport', (req, res) => {
    const country_name = req.query.country_name;
    const last_history = countryService.getHistoryCountry( country_name );
    if ( last_history.length > 0 ) {
        return res.status(200).json({
            ok: true,
            country_name,
            last_history
        });
    } else {
        return res.status(404).json({
            ok: false,
            message: 'country not found'
        });
    }
});

app.get('/getAllCountries', (req, res) => {
    const countries = countryService.getAllCountries();
    return res.status(200).json({
        ok: true,
        countries,
        total_countries: Object.keys(countries).length
    })
});


module.exports = app;
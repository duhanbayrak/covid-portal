const { data } = require('cheerio/lib/api/attributes');
const { response } = require('express');

const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 80,
    bodyParser = require("body-parser"),
    nodemon = require("nodemon"),
    request = require('request'),
    axios = require('axios'),
    jsdom = require('jsdom'),
    cheerio = require('cheerio'),
    fs = require('file-system'),
    { JSDOM } = jsdom

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


app.get('/', function (req, res) {
    var options = {
        "method": "GET",
        "url": "https://disease.sh/v3/covid-19/countries",
        "headers": {

        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        var data = JSON.parse(response.body);
        res.render("index", { data: data });

    });
})

app.get('/country/:country', function (req, res) {

    var options = {
        "method": "GET",
        "url": `https://disease.sh/v3/covid-19/countries/${req.params.country}`,
        "headers": {

        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        var data = JSON.parse(response.body)
        if (req.params.country === 'Turkey') {
            res.redirect("/turkey")
        }
        else {
            res.render("country", { data: data });
        }
    });
})
app.get('/news', function (req, res) {
    var options = {
        "method": "GET",
        "url": "https://newsapi.org/v2/top-headlines?country=tr&category=health&apiKey=6fbf8ad1b4cc439184fcac65072c6559",
        "headers": {

        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        var news = JSON.parse(response.body)
        res.render("news", { news: news.articles });
    });
})
app.get('/turkey', function (req, res) {

    const url = 'https://covid19.saglik.gov.tr/?lang=tr-TR';

    axios.get(url)  //Sağlık Bakanlığı sitesinden verileri alıyoruz.
        .then(response => {
            getNodes(response.data);
        })
        .catch(error => {
            console.error(error);
        })

    const getNodes = html => {
        const il_vaka = []
        const il_asi = [],

            dom = new JSDOM(html),
            data_il_vaka = dom.window.document.querySelectorAll('#illere_gore_vaka_sayisi g'),
            data_il_asi = dom.window.document.querySelectorAll('#svg-turkiye-haritasi-tamamlanan g');

        data_il_vaka.forEach(item => {
            il_vaka.push({
                iladi: item.getAttribute('data-adi'),
                detay: item.getAttribute('data-detay')

            })

        });
        data_il_asi.forEach(item => {
            il_asi.push({
                iladi: item.getAttribute('data-adi'),
                yuzde: item.getAttribute('data-yuzde'),

            })
        });

        il_vaka.shift();
        il_asi.shift();

        var sortingAsi = [];//Alfabetik sıraya göre sıralanmış Aşı dizisi

        il_asi.forEach(element => {
            sortingAsi.push(element)
        });

        sortingAsi.sort(function alphabeticSorting(a, b) { //Aşı Dizisi Alfabetik Sıralama
            var aName = a.iladi;
            var bName = b.iladi;
            var alfabe = "AaBbCcÇçDdEeFfGgĞğHhIıİiJjKkLlMmNnOoÖöPpQqRrSsŞşTtUuÜüVvWwXxYyZz0123456789";
            if (aName.length === 0 || bName.length === 0) {
                return aName.length - bName.length;
            }
            for (var i = 0; i < aName.length && i < bName.length; i++) {
                var ai = alfabe.indexOf(aName[i]);
                var bi = alfabe.indexOf(bName[i]);
                if (ai !== bi) {
                    return ai - bi;
                }
            }
        });

        var asi_ilkon_il = il_asi.slice(0, 10),
            asi_sonon_il = il_asi.slice(-10)

        var sortingCases = [] //Vaka sayısına göre sıralanmış dizi

        il_vaka.forEach(element => {
            sortingCases.push({
                iladi: element.iladi,
                detay: parseFloat((element.detay).replace(",", "."))
            })
        });

        //Vaka sayısına göre sıralama işlemi
        for (let i = 0; i < sortingCases.length; i++) {
            var min = i;
            for (var j = i + 1; j < sortingCases.length; j++) {
                if (sortingCases[j].detay < sortingCases[min].detay) {
                    min = j;
                }
            }
            var temp = sortingCases[i];
            sortingCases[i] = sortingCases[min];
            sortingCases[min] = temp;
        }

        var vaka_ilkon_il = sortingCases.slice(0, 10),
            vaka_sonon_il = sortingCases.slice(-10)

        
        res.render("turkey", { vaka: il_vaka, asi: il_asi, sortingAsi: sortingAsi, asi_ilkon_il: asi_ilkon_il, asi_sonon_il: asi_sonon_il, vaka_ilkon_il: vaka_ilkon_il, vaka_sonon_il: vaka_sonon_il});
        
    }

})
app.get('/world', function (req, res) {

    res.render("world");

})

app.get('/usa', function (req, res) {

    const url = 'https://www.worldometers.info/coronavirus/country/us/';

    var usaData = [];

    axios.get(url)
        .then((response) => {
            let $ = cheerio.load(response.data);
            $('.total_row_usa td').each(function (i, e) {
                usaData[i] = $(e).text();
            })
        })
        .then(() => {
            usaData.splice(11, 28);
            usaData.splice(0, 2);
            console.log(usaData)
            res.render("usa", { usaData });
        })
        .catch(function (e) {
            console.log(e);
        });




})

app.listen(PORT, () => console.log("Example app listening on port port!"));
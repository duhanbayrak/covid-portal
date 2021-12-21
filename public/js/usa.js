const population = document.querySelector("#population");
const critical = document.querySelector("#critical");
const c_details_container = document.querySelector("#c-details-container");
const c_head = document.querySelector("#c-head");



function divideNumber(number) { //Sayıları noktalı hale getirmek için
    return number.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1' + ".");
}

async function loadData() {
    const response_usa = await fetch('https://disease.sh/v3/covid-19/countries/840')
    const response = await fetch('https://disease.sh/v3/covid-19/historical/840?lastdays=all');
    const response_data = await fetch('https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.json');

    const daily_data = await response_usa.json();
    const usa_historical_data = await response.json();
    const data = await response_data.json();

    
    c_head.innerHTML = `
        <h1><i class="fas fa-globe-europe"></i>
            USA
        </h1>
        <div class="col-sm c-details" >
            <h6>Nufüs</h6>  
            <h5>
                ${divideNumber(daily_data.population)}
            </h5>
            
        </div>`;
    
    population.innerHTML = `
        <h2>
            ${divideNumber(daily_data.population)}
        </h2>
        <h6 class="text-muted">Nüfus</h6>
    `;
    critical.innerHTML = `
        <h2>
            ${divideNumber(daily_data.critical)}
        </h2>
        <h6 class="text-muted">Kritik Hasta</h6>
    
    `;
    var ctx_pie1 = document.getElementById('pieChart1').getContext('2d');
    var pieChart1 = new Chart(ctx_pie1, {
        type: 'pie',
        data: {
            labels: [
                'Toplam Vefat',
                'Toplam Vaka',
                'Toplam İyileşen',
            ],
            datasets: [{
                label: 'My First Dataset',
                data: [daily_data.deaths, daily_data.cases, daily_data.recovered],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    '#4E9F3D',

                ],
                hoverOffset: 4
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    var ctx_pie2 = document.getElementById('pieChart2').getContext('2d');
    var pieChart = new Chart(ctx_pie2, {
        type: 'pie',
        data: {
            labels: [
                'Aşı Olanlar',
                'Aşı Olmanyanlar',
            ],
            datasets: [{
                label: 'My First Dataset',
                data: [data.USA.people_vaccinated, data.USA.population - data.USA.people_vaccinated],
                backgroundColor: [
                    'rgb(54, 162, 235)',
                    'rgb(255, 99, 132)',

                ],
                hoverOffset: 4
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


}


function get_historical_data() { //Burada is uzaktaki bir json dosyasından verileri çekiyoruz.


    fetch(`https://disease.sh/v3/covid-19/historical/840?lastdays=all`)
        .then(res => res.json())
        .then(data => {
            var data_historical = JSON.stringify(data)
            let historical = JSON.parse(data_historical);
            const historical_cases = Object.values(historical.timeline.cases);
            const historical_deaths = Object.values(historical.timeline.deaths);

            var hist_cases = [];
            var hist_deaths = [];

            historical_cases.forEach(element => {
                hist_cases.push(element)
            });
            historical_deaths.forEach(element => {
                hist_deaths.push(element)
            });

            var dailyCases = [],
                dailyDeaths = [];

            
            for (let index = 0; index < hist_cases.length; index++) {
                dailyCases.push(parseInt(hist_cases[index + 1]) - parseInt(hist_cases[index]))
                dailyDeaths.push(parseInt(hist_deaths[index + 1]) - parseInt(hist_deaths[index]))
            }

            var tarih = []
            for (let index = 1; index < historical_cases.length; index++) {
                tarih.push(index + '.' + 'Gün')
            }


            var ctx = document.getElementById('historicalCases').getContext('2d');
            var deathChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: tarih,
                    datasets: [{
                        label: 'Günlere Göre Vaka Sayıları',
                        data: dailyCases,
                        backgroundColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            var ctx = document.getElementById('historicalDeaths').getContext('2d');
            var deathChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: tarih,
                    datasets: [{
                        label: 'Günlere Göre Vefat Sayıları',
                        data: dailyDeaths,
                        backgroundColor: '#FF0075',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            fetch(`https://disease.sh/v3/covid-19/countries/${country}`)
                .then(res => res.json())
                .then(dataCountry => {
                    var country_str = JSON.stringify(dataCountry)
                    let country_parse = JSON.parse(country_str);

                    var ctx_pie = document.getElementById('pieChart').getContext('2d');
                    var pieChart = new Chart(ctx_pie, {
                        type: 'pie',
                        data: {
                            labels: [
                                'Toplam Vefat',
                                'Toplam Vaka',
                                'Toplam İyileşen',
                            ],
                            datasets: [{
                                label: 'My First Dataset',
                                data: [country_parse.deaths, country_parse.cases, country_parse.recovered],
                                backgroundColor: [
                                    'rgb(255, 99, 132)',
                                    'rgb(54, 162, 235)',
                                    'rgb(54, 162, 120)',

                                ],
                                hoverOffset: 4
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                })
        })

}

loadData();
get_historical_data();
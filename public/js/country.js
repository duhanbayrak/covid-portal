const url = window.location.href  //Yayınlandığında değiştirilecek URL

const country = url.substring(url.lastIndexOf('/') + 1);

async function loadData() {
    
    const response_all = await fetch('https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.json');
    const response_country = await fetch(`https://disease.sh/v3/covid-19/countries/${country}`)

   
    const daily_data = await response.json();
    const all_data = await response_all.json();
    const country_daily_data = await response_country.json();

    c_head.innerHTML = `
        <h1><i class="fas fa-globe-europe"></i>
            Turkey
        </h1>
        <div class="col-sm c-details" >
            <h6>Nufüs</h6>  
            <h5>
                ${divideNumber(all_data.TUR.population)}
            </h5>
            
        </div>`;
    newCases.innerHTML = `
                <h3>+${divideNumber(daily_data.dailyInfected)}</h3>
                <h6>Yeni Vakalar</h6>
            `;

    newDeaths.innerHTML = `
                <h3>+${divideNumber(daily_data.dailyDeceased)}</h3>
                <h6>Yeni Ölüm</h6>
            `;

    c_details_container.innerHTML = `
        <div class="row">
            <div class="col-sm c-details">
                <h2>
                    ${divideNumber(all_data.TUR.total_cases)}
                </h2>
            <h6 class="text-muted">Toplam Vaka</h6>
        </div>
        <div class="col-sm c-details">
            <h2>
                ${divideNumber(all_data.TUR.total_deaths)}
            </h2>
            <h6 class="text-muted">Toplam Vefat</h6>
        </div>
        <div class="col-sm c-details">
            <h2>
                ${divideNumber(all_data.TUR.total_tests)}
            </h2>
            <h6 class="text-muted">Toplam Test</h6>
        </div>
    </div>
    <div class="row">
        <div class="col-sm c-details">
            <h2>
                %${divideNumber((Number(all_data.TUR.total_cases * 100) / Number(all_data.TUR.population)).toFixed(2))}
            </h2>
            <h6 class="text-muted">Nüfusa Göre Vaka Oranı</h6>
        </div>
        <div class="col-sm c-details">
            <h2>
                %${divideNumber((Number(all_data.TUR.total_cases * 100) / Number(all_data.TUR.total_tests)).toFixed(2))}
            </h2>
            <h6 class="text-muted">Yapılan Testlerin Pozitif Çıkma Oranı</h6>
        </div>
        <div class="col-sm c-details">
            <h2>
                %${divideNumber((Number(all_data.TUR.total_deaths * 100) / Number(all_data.TUR.total_cases)).toFixed(2))}
            </h2>
            <h6 class="text-muted">Ölüm Oranı</h6>
            
        </div>
    </div>
    <div class="row">
        <div class="col-sm c-details">
            <h2>
                ${divideNumber(all_data.TUR.people_vaccinated)}
            </h2>
            <h6 class="text-muted">1. Doz Aşı Uygulanan</h6>
        </div>
        <div class="col-sm c-details">
            <h2>
                ${divideNumber(all_data.TUR.people_fully_vaccinated)}
            </h2>
            <h6 class="text-muted">2. Doz Aşı Uygulanan</h6>
        </div>
        <div class="col-sm c-details">
            <h2>
                %${divideNumber(all_data.TUR.people_vaccinated_per_hundred)} 
            </h2>
            <h6 class="text-muted">Her 100 Kişide Aşılama</h6>
        </div>
    </div>
    <div class="row">
        <div class="col-sm c-details">
            <h2>
                ${divideNumber(all_data.TUR.hospital_beds_per_thousand)} /Bin
            </h2>
            <h6 class="text-muted">Hastane Yatak Doluluk Oranı</h6>
        </div>
        <div class="col-sm c-details">
            <h2>
                ${divideNumber(daily_data.dailyRecovered)}
            </h2>
            <h6 class="text-muted">Bugün İyileşen</h6>
        </div>
        <div class="col-sm c-details">
            <h2>
                ${divideNumber(all_data.TUR.new_tests)}
            </h2>
            <h6 class="text-muted">Bugünkü Test</h6>
        </div>
    </div>
    `;
    var ctx_pie1 = document.getElementById('pieChart1').getContext('2d');
    var pieChart1 = new Chart(ctx_pie1, {
        type: 'pie',
        data: {
            labels: [
                'Toplam Vefat',
                'Toplam İyileşen',
            ],
            datasets: [{
                label: 'My First Dataset',
                data: [((turkey_daily_data.deaths*100)/turkey_daily_data.cases).toFixed(1),((turkey_daily_data.recovered*100)/turkey_daily_data.cases).toFixed(1)],
                backgroundColor: [
                    'rgb(255, 99, 132)',
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
                'Aşı Olanlar %',
                'Aşı Olmanyanlar %',
            ],
            datasets: [{
                label: 'My First Dataset',
                data: [((all_data.TUR.people_vaccinated*100)/all_data.TUR.population).toFixed(1), (((all_data.TUR.population - all_data.TUR.people_vaccinated)*100)/all_data.TUR.population).toFixed(1)],
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


    fetch(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`)
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

get_historical_data()
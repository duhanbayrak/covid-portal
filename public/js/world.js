const newCases = document.querySelector("#newCases"),
    newDeaths = document.querySelector("#newDeaths"),
    population = document.querySelector("#population"),
    totalCases = document.querySelector("#toplam-vaka"),
    totalDeaths = document.querySelector("#toplam-vefat"),
    totalTests = document.querySelector("#toplam-test"),
    activeCases = document.querySelector("#aktif-vaka"),
    positiveRate = document.querySelector("#pozitif-oran"),
    caseRate = document.querySelector("#vaka-oran"),
    deathRate = document.querySelector("#vefat-oran"),
    critical = document.querySelector("#kritik-hasta"),
    recovered = document.querySelector("#toplam-iyilesen")

function divideNumber(number) {
    return number.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1' + ".");
}

async function loadData() {
    const response = await fetch('https://disease.sh/v3/covid-19/all');
    const response_historical = await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all')

    const historical_data = await response_historical.json()
    const data = await response.json();

    const historical_cases = Object.values(historical_data.cases);
    const historical_deaths = Object.values(historical_data.deaths);

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




    population.innerHTML = `
        <h6>Nufüs</h6>
        <h5>
            ${divideNumber(data.population)}
        </h5>
    `;

    newCases.innerHTML = `
        <h3>+${divideNumber(data.todayCases)}</h3>
        <h6>Yeni Vakalar</h6>`;

    newDeaths.innerHTML = `
        <h3>+${divideNumber(data.todayDeaths)}</h3>
        <h6>Yeni Ölüm</h6>`;

    totalCases.innerHTML = `
        <h3>${divideNumber(data.cases)}</h3>
        <h6 class="text-muted">Toplam Vaka</h6>`;

    totalDeaths.innerHTML = `
        <h3>${divideNumber(data.deaths)}</h3>
        <h6 class="text-muted">Toplam Ölüm</h6>`;

    totalTests.innerHTML = `
        <h3>${divideNumber(data.tests)}</h3>
        <h6 class="text-muted">Toplam Test</h6>`;

    positiveRate.innerHTML = `
        <h3>%${((data.cases) * 100 / (data.tests)).toFixed(2)}</h3>
        <h6 class="text-muted">Yapılan Testlerin Pozitif Olma Oranı</h6>`;

    caseRate.innerHTML = `
        <h3>%${((data.cases) * 100 / (data.population)).toFixed(2)}</h3>
        <h6 class="text-muted">Nüfusa Göre Vaka Oranı</h6>`;

    deathRate.innerHTML = `
        <h3>%${((data.deaths) * 100 / (data.cases)).toFixed(2)}</h3>
        <h6 class="text-muted">Ölüm Oranı</h6>`;

    activeCases.innerHTML = `
        <h3>${divideNumber(data.active)}</h3>
        <h6 class="text-muted">Aktif Vaka</h6>`;

    critical.innerHTML = `
        <h3>${divideNumber(data.critical)}</h3>
        <h6 class="text-muted">Kritik Hasta</h6>`;

    recovered.innerHTML = `
        <h3>${divideNumber(data.recovered)}</h3>
        <h6 class="text-muted">Toplam İyileşen</h6>`;


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
    var ctx_pie = document.getElementById('pieChart').getContext('2d');
    var pieChart = new Chart(ctx_pie, {
        type: 'pie',
        data: {
            labels: [
                'Toplam Ölüm',
                'Toplam Vaka',
                'Toplam İyileşen',
            ],
            datasets: [{
                label: 'My First Dataset',
                data: [data.deaths, data.cases, data.recovered],
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

}
loadData();


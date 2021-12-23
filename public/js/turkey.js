const newCases = document.querySelector("#newCases");
const newDeaths = document.querySelector("#newDeaths");
const c_details_container_1 = document.querySelector("#c-details-container-1");
const c_details_container_2 = document.querySelector("#c-details-container-2");
const c_head = document.querySelector("#c-head");

const element = document.querySelector('#svg-turkiye-haritasi');
const info = document.querySelector('.il-isimleri');

function divideNumber(number) { //Sayıları noktalı hale getirmek için

    return number.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1' + ".");

}

async function loadData() {
    
    const response_all = await fetch('https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.json');
    const response_turkey = await fetch('https://disease.sh/v3/covid-19/countries/792');
    const response_gunluk = await fetch('https://raw.githubusercontent.com/duhanbayrak/covid19_turkey_api/master/dataset/data.json')//Kendi yazdığım API


   
    const all_data = await response_all.json();
    const turkey_daily_data = await response_turkey.json();
    const gunluk_veri = await response_gunluk.json();

    c_head.innerHTML = `
        <h1><i class="fas fa-globe-europe"></i>
            Turkey
        </h1>
        <div class="col-sm c-details" >
            <h6>
                Nufüs
            </h6>  
            <h5>
                ${divideNumber(turkey_daily_data.population)}
            </h5>
            
        </div>`;
    newCases.innerHTML = `
                <h3>+${gunluk_veri.todayCases}</h3>
                <h6>
                    Yeni Vakalar
                </h6>
            `;

    newDeaths.innerHTML = `
                <h3>+${gunluk_veri.todayDeaths}</h3>
                <h6>
                    Yeni Ölüm
                </h6>
            `;

    c_details_container_1.innerHTML += `
        <div class="row">
            <div class="col-sm c-details">
                <h2>
                    ${divideNumber(all_data.TUR.total_cases)}
                </h2>
            <h6 class="text-muted">
                Toplam Vaka
            </h6>
        </div>
        <div class="col-sm c-details">
            <h2>
                ${divideNumber(all_data.TUR.total_deaths)}
            </h2>
            <h6 class="text-muted">
                Toplam Vefat
            </h6>
        </div>
        <div class="col-sm c-details">
            <h2>
                ${divideNumber(all_data.TUR.total_tests)}
            </h2>
            <h6 class="text-muted">
                Toplam Test
            </h6>
        </div>
    </div>
    <div class="row">
        <div class="col-sm c-details">
            <h2>
                %${divideNumber((Number(turkey_daily_data.cases * 100) / Number(turkey_daily_data.population)).toFixed(2))}
            </h2>
            <h6 class="text-muted">
                Nüfusa Göre Vaka Oranı
            </h6>
        </div>
        <div class="col-sm c-details">
            <h2>
                %${divideNumber((Number(turkey_daily_data.cases * 100) / Number(turkey_daily_data.tests)).toFixed(2))}
            </h2>
            <h6 class="text-muted">
                Yapılan Testlerin Pozitif Çıkma Oranı
            </h6>
        </div>
        <div class="col-sm c-details">
            <h2>
                %${divideNumber((Number(turkey_daily_data.deaths * 100) / Number(turkey_daily_data.cases)).toFixed(2))}
            </h2>
            <h6 class="text-muted">
                Ölüm Oranı
            </h6>
            
        </div>
    </div>
   
    <div class="row">
        <div class="col-sm c-details">
            <h2>
                ${divideNumber(all_data.TUR.hospital_beds_per_thousand)} /Bin
            </h2>
            <h6 class="text-muted">
                Hastane Yatak Doluluk Oranı
            </h6>
        </div>
        <div class="col-sm c-details">
            <h2>
                ${gunluk_veri.todayRecovered}
            </h2>
            <h6 class="text-muted">
                Bugün İyileşen
            </h6>
        </div>
        <div class="col-sm c-details">
            <h2>
                ${gunluk_veri.todayTests}
            </h2>
            <h6 class="text-muted">
                Bugünkü Test
            </h6>
        </div>
    </div>
    `;
    c_details_container_2.innerHTML += `
        <div class="row">
                <div class="col-sm c-details">
                    <h2>
                        ${gunluk_veri.first_vaccines}
                    </h2>
                    <h6 class="text-muted">
                        1.Doz Uygulanan
                    </h6>
                </div>
                <div class="col-sm c-details">
                    <h2>
                        ${gunluk_veri.second_vaccines}
                    </h2>
                    <h6 class="text-muted">
                        2.Doz Uygulanan
                    </h6>
                </div>
                <div class="col-sm c-details">
                    <h2>
                        ${gunluk_veri.third_vaccines}
                    </h2>
                    <h6 class="text-muted">
                        3.Doz Uygulanan
                    </h6>
                </div>
            </div>
            <div class="row">
                <div class="col-sm c-details">
                    <h2>
                        ${gunluk_veri.first_vaccines_ratio}
                    </h2>
                    <h6 class="text-muted">
                        1.Doz Aşı Yapılma Oranı
                    </h6>
                </div>
                <div class="col-sm c-details">
                    <h2>
                        ${gunluk_veri.second_vaccines_ratio}
                    </h2>
                    <h6 class="text-muted">
                        2.Doz Aşı Yapılma Oranı
                    </h6>
                </div>
                <div class="col-sm c-details">
                    <h2>
                        ${gunluk_veri.total_vaccines}
                    </h2>
                    <h6 class="text-muted">
                        1., 2. Ve 3.Doz Toplam
                    </h6>
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
                data: [(turkey_daily_data.deaths), (turkey_daily_data.recovered)],
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
                'En Az 2 Doz Aşı Olanlar %',
                'Aşı Olmanyanlar %',
            ],
            datasets: [{
                label: 'My First Dataset',
                data: [((all_data.TUR.people_vaccinated * 100) / all_data.TUR.population).toFixed(1), (((all_data.TUR.population - all_data.TUR.people_vaccinated) * 100) / all_data.TUR.population).toFixed(1)],
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

function svgturkiyeharitasi() {

    element.addEventListener(
        'mouseover',
        function (event) {
            if (event.target.tagName === 'path') {
                info.innerHTML = [
                    `<div>
                        <h1 class="text-center">${event.target.parentNode.getAttribute('data-iladi')}</h1>
                        <h3><i class="fas fa-user-injured"></i> Vaka Sayısı: <span class="data-attr">${event.target.parentNode.getAttribute('data-vaka')}</span></h3>
                        <h3><i class="fas fa-syringe"></i> Aşılanma Oranı:  <span class="data-attr">${event.target.parentNode.getAttribute('data-asi')}</span></h3>
                    </div>`
                ].join('');

            }

        }
    );

    element.addEventListener(
        'mousemove',
        function (event) {
            info.style.top = event.pageY + 25 + 'px';
            info.style.left = event.pageX + 'px';

        }
    );

    element.addEventListener(
        'mouseout',
        function (event) {
            info.innerHTML = '';
        }
    );

    element.addEventListener(
        'click',
        function (event) {
            if (event.target.tagName === 'path') {
                const parent = event.target.parentNode;
                const id = parent.getAttribute('id');

                window.location.href = (
                    '#'
                    + id
                    + '-'
                    + parent.getAttribute('data-plakakodu')
                );
            }
        }
    );


}

function get_historical_data() { //Burada is uzaktaki bir json dosyasından verileri çekiyoruz.

    const date = [],
        cases = [],
        patients = [],
        deaths = [];

    fetch("https://raw.githubusercontent.com/ozanerturk/covid19-turkey-api/master/dataset/timeline.json")
        .then(res => res.json())
        .then(vaka => {

            var vakajson = JSON.stringify(vaka)
            let vakaJsonParse = JSON.parse(vakajson);
            const tableData = Object.values(vakaJsonParse);

            tableData.forEach((el) => {

                date.push(el.date);
                cases.push(el.cases);
                patients.push(el.patients);
                deaths.push(el.deaths);
            });


            //Sağlık Bakanlığındaki hasta ve vaka verileri ayrı olduğu için birleştirme işlemi Start>>>
            let case_1 = [],
                case_2 = [],
                case_3 = [];

            for (let index = 0; index < 260; index++) {
                case_1.push(patients[index])
            }

            for (let index = 260; index < 481; index++) {
                case_2.push(parseInt(cases[index]) + parseInt(patients[index]))
            }

            for (let index = 481; index < cases.length; index++) {
                case_3.push(cases[index])
            }

            let d = case_1.concat(case_2)
            let all_cases = d.concat(case_3)

            //Sağlık Bakanlığındaki hasta ve vaka verileri ayrı olduğu için birleştirme işlemi End<<<


            var ctx_death = document.getElementById('deathChart').getContext('2d');
            var deathChart = new Chart(ctx_death, {
                type: 'bar',
                data: {
                    labels: date,
                    datasets: [{
                        label: 'Günlere Göre Vefat Sayıları',
                        data: deaths,
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
            var ctx_cases = document.getElementById('caseChart').getContext('2d');
            var caseChart = new Chart(ctx_cases, {
                type: 'bar',
                data: {
                    labels: date,
                    datasets: [{
                        label: 'Günlere Göre Vaka Sayıları',
                        data: all_cases,
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
            fetch('https://disease.sh/v3/covid-19/historical/792?lastdays=all')
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



                })
        });

}

loadData();
svgturkiyeharitasi();
get_historical_data();

const element = document.querySelector('#svg-harita'),
    info = document.querySelector('.ulke-isimleri'),
    totalCases = document.querySelector("#totalCases"),
    totalTests = document.querySelector("#totalTests"),
    totalDeaths = document.querySelector("#totalDeaths"),
    totalRecovered = document.querySelector("#totalRecovered")

function divideNumber(number) {

    return number.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1' + ".");
    
}

element.addEventListener(
    'mouseover',
    function (event) {
        if (event.target.tagName === 'path') {
            info.innerHTML =
                `
                            <div class="card info-card" style = "width: 12rem;" >

                                <img class="card-img-top" src="${event.target.getAttribute('data-flag')}" alt="Card image cap">

                                    <div class="card-body">

                                        <h4 class="card-title text-center">${event.target.getAttribute('data-name')}</h4>

                                        <div id="path-newCase">
                                            <h6 class= "card-text text-center" >Yeni Vaka: + ${divideNumber(event.target.getAttribute('data-new'))}</h6>
                                        </div>
                                        
                                        <h4 class= "card-text mt-3">Toplam Vaka: ${divideNumber(event.target.getAttribute('data-cases'))}</h4>
                                        <h4 class= "card-text mt-3">Toplam Ölüm: ${divideNumber(event.target.getAttribute('data-deaths'))}</h4>
                                        
                                    </div>
                            </div>`

        }
    }

);
element.addEventListener(
    'mousemove',
    function (event) {

        info.style.top = event.pageY + -50 + 'px';
        info.style.left = event.pageX + -500 + 'px';
    }
);
element.addEventListener(
    'mouseout',
    function (event) {

        info.innerHTML = '';
    }
);
function get_world_data() { //Burada is uzaktaki bir json dosyasından verileri çekiyoruz.

    fetch("https://disease.sh/v3/covid-19/all")
        .then(res => res.json())
        .then(world => {
            var worldJson = JSON.stringify(world)
            let worldData = JSON.parse(worldJson);

            totalCases.innerHTML = `

                                <h5>${divideNumber(worldData.cases)}</h5>
                                <h6 class="text-muted">Toplam Vaka</h6>
                        `;
            totalTests.innerHTML = `

                                <h5>${divideNumber(worldData.tests)}</h5>
                                <h6 class="text-muted">Toplam Test</h6>
                        `;
            totalDeaths.innerHTML = `

                                <h5>${divideNumber(worldData.deaths)}</h5>
                                <h6 class="text-muted">Toplam Ölüm</h6>
                        `;
            totalRecovered.innerHTML = `

                                <h5>${divideNumber(worldData.recovered)}</h5>
                                <h6 class="text-muted">Toplam İyileşen</h6>
                        `;
        })

}
get_world_data()



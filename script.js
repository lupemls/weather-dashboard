
$(document).ready(function(){
    let cities = [];

    init();
    $('.form-inline').submit(function(event){
        let city = $('#city-input').val().trim();
        if(!cities.includes(city)){
            cities.splice(0, 0, city)
            // console.log('array', cities)
            localStorage.setItem('localCities', JSON.stringify(cities));
        }
        init(event, city);
        // loadCityWeather(event, city);

    })

    $('.city').click(function(){
        let clickedCity = $(this).text();
        loadCityWeather(event, clickedCity);
    })

    //loads the weather information(current, uv index, and five day) for a given city
    function loadCityWeather(event, city){
        if(event){
            event.preventDefault();
        }
        // let city = $('#city-input').val();
        let apiKey = 'aaa01f08f0808ab3abae1820d94fad25';
        
        //used to access data on the current weather of a location
        let queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        $.ajax({
            url: queryUrl,
            method:'GET'
        }).then(function(response) {
            currentWeather(response);   
            
            let lat = response.coord.lat;
            let lon = response.coord.lon;

            //uses the latitude and longitude from the previous current weather to get the uv index at that location
            let uvIndexUrl = `http://api.openweathermap.org/data/2.5/uvi/forecast?appid=${apiKey}&lat=${lat}&lon=${lon}`;
            //gets the uv Index
            $.ajax({
                url:uvIndexUrl,
                method:'GET'
            }).then(function(object){
                let uvValue = object[0].value;
                let span = $('<span>').text(uvValue);
                $('#uv').text('UV Index: ').append(span);
            })

            //uses the latitude and longitude to get the weather for the next five days
            let fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            console.log(fiveDayUrl)
            $.ajax({
                url:fiveDayUrl,
                method:'GET'
            }).then(function(json){
                console.log(json);
                fiveDayWeather(json);
            })
        })
    }

    //sets up the local array of searched cities, and loads the page to the last searched city
    function init(){
        let storedCities = JSON.parse(localStorage.getItem('localCities'));
        console.log('stored', storedCities)
        if(!storedCities){
            console.log('cheese')
            localStorage.setItem('localCities', JSON.stringify(cities));
        }
        else{
            cities = storedCities;
            loadCityWeather(event, cities[0])
            let list = $('#city-buttons');  list.empty();      
            for(let i = 0; i < cities.length; i++){
                list.append($('<button>').text(cities[i]).attr('class', 'city'));
                $('#cities').append(list);
            }
        }

    }

    //gets the current weather at the searched location
    function currentWeather(response){
        let today = toDate(response.dt);
        let icon = getIcon(response);
        console.log(response);
        // let icon = $('<img>').attr({
        //     'src': iconUrl,
        //     'class': 'icon'
        // })
        $('#title').text(`${response.name} ${today}`).append(icon);
        //converts the temperature from kelvin to fahrenheit
        let temp = (kToF(response.main.temp, 1)); 
        $('#temp').text(`Temperature: ${temp}\u00B0F`);
        $('#humidity').text(`Humidity: ${response.main.humidity}%`);
        $('#wind').text(`Wind Speed: ${response.wind.speed}`);
    }

    //gets data for the next five days of the searched location, and adds the temperature and humidity at 24 hour increment from the time searched
    function fiveDayWeather(response){
        console.log('5 day', response)
        let data = response.list
        let day = 1;
        for(let i = 7; i < data.length; i=(i+8)){
            let nextDay = $('<h5>').text(toDate(data[i].dt));
            let weatherInfo = $('<div>');//.attr('class', 'info');
            let icon = getIcon(data[i]);
            weatherInfo.append(icon);
            weatherInfo.append($('<div>').text(`Temp: ${kToF(data[i].main.temp, 2)} \u00B0F`));
            weatherInfo.append($('<div>').text(`Humidity: ${data[i].main.humidity}%`));
            let card = $(`.${day}`)
            card.empty();
            card.append(nextDay, weatherInfo);
            day++;
        }
    }    
    //converts temperatures from kelvin to fahrenheit
    function kToF(temp, decimal){
        return ((temp-273.15) * 1.8 + 32).toFixed(decimal);
    }
    //formats a date given the dt to put the date in a month/day/year format
    function toDate(today){
        let date = new Date(today*1000);

        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        let formattedDate = `${month}/${day}/${year}`;
        return formattedDate;
    }

    //gets the weather icon, returning a new image element of the icon
    function getIcon(json){
        let iconCode = json.weather[0].icon;
        let iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`
        let icon = $('<img>').attr({
            'src': iconUrl,
            'class': 'icon'
        })
        return icon;
    }
})


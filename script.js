$(document).ready(function(){

// let city = prompt('city');
// let queryUrl = `api.openweathermap.org/data/2.5/weather?q=${city}`
//     $.ajax({
//         url: queryUrl,
//         method:'GET'
//     }).then(function(response) {
//         console.log(response);
//     })

    $('.form-inline').submit(function(event){
        event.preventDefault();
        let city = $('#city-input').val();
        let apiKey = 'aaa01f08f0808ab3abae1820d94fad25';

        let queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        $.ajax({
            url: queryUrl,
            method:'GET'
        }).then(function(response) {
            // let today = Date(response.dt);
            let today = toDate(response.dt);
            console.log(response);
            // console.log(response.dt, 'todays milliseconds')
            $('.card-title').text(`${response.name} ${today}`);
            //converts the temperature from kelvin to fahrenheit
            let temp = ((response.main.temp - 273.15) * 1.80 + 32).toFixed(1); 
            $('#temp').text(`Temperature: ${temp}\u00B0F`);
            $('#humidity').text(`Humidity: ${response.main.humidity}`);
            $('#wind').text(`Wind Speed: ${response.wind.speed}`);
            $('#uv').text(`UV Index: `);// might have to make another call http://api.openweathermap.org/data/2.5/uvi/forecast?appid={appid}&lat={lat}&lon={lon}
            

        })

    })

    function toDate(today){
        let now = Date(today);
        let date = new Date(now);

        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        let formattedDate = `${month}/${day}/${year}`;
        return formattedDate;
    }
})


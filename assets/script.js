
//conect JS to the elements in HTML
    var cityName = document.getElementById("seach-city");
    var todaydate = document.getElementById("jumbotron")
    var newName = document.getElementById("button");
    var icons = document.getElementsByClassName("icons")
   
    function GetInfo(e){
    var searchCity = cityName.value
    cityName.innerHTML = oneDay.value
   // todaydate.innerHTML = firstFetch.value
    console.log(cityName.value)
    e.preventDefault();
    firstFetch(searchCity);  
}


//Fetch for today's forcast in the jumbotron
    
   function firstFetch(searchCity){
    fetch("http://api.openweathermap.org/geo/1.0/direct?q="+searchCity+"&appid=962435ef3bd63c2c118e361ff306ea67")
        .then(function (response){
        //  console.log("DATA: ",  response); 
//return response.json();
        return response.json(); 
        })
        .then(data =>{ 
        console.log(data)
        var lon = data[0].lon
        var lat = data[0].lat

     oneDay(lon, lat); 

        })

// Catch if there is an error 
    .catch(err =>alert("xy"))
    }
  

newName.addEventListener ("click", GetInfo); 

// Fetch five days weather forcast 
function oneDay(lat, lon){

    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=-84.3902644&lon=33.7489924&appid=90745043da61332797363ccc88a4cad0")
.then(response=> {
    return response.json()
})
    .then(data =>{
        console.log(data);

        var KelvinTemp = data.list[0].main.temp; 
        var convertTemp = ((KelvinTemp -273.15)*1.8)+32
        var windInfo = data.list[0].wind.speed
        var humidityInfo = data.list[0].main.humidity

        var temp = document.createElement("p")
        var wind = document.createElement("p")
        var humidity = document.createElement("p")
        
        temp.textContent = `Temperature: ${convertTemp}`; 
        wind.textContent = `Wind: ${windInfo}`; 
        humidity.textContent = `Humidity: ${humidityInfo}`; 

        console.log(temp)
        console.log(humidity)
        console.log(temp)
    
       todaydate.append(temp, wind, humidity); 
       console.log(todaydate)
      
// Catch if there is an error 
.catch(err =>alert("Something Went Wrong"))
        

})
        function fiveDays(){
        for(i=0;i<5;i++){
        document.getElementById(` + (i+1)+ Temperature`).innerHTML ="Temp:" + Number(data.list[i].main.temp);
    }  
    for(i=0;i<5;i++){
        document.getElementById("day" + (i+1)+ "Wind").innerHTML ="Wind:" + Number(data.list[i].wind.speed -4.78).toFixed(0);
    }  
    for(i=0;i<5;i++){
        document.getElementById("day" + (i+1)+ "Humidity").innerHTML ="Humidity:" + Number(data.list[i].main.humidity -69).toFixed(0);
    }  
    for(i=0;i<5;i++){
        document.getElementById("img" +(i+1)).src = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon+".png";
    }
    i.innerHTML = oneDay; 
}
fiveDays()
}
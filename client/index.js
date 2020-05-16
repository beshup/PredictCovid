var btn = document.getElementById('submitLocation');
btn.addEventListener('click', () => {

    var location = $('.mapboxgl-ctrl-geocoder---input')[0].value;
    if(location == null){
        alert('nothing in search term');
    }
    else{
        fetch('//findSentimentInLocation', {
            method: "POST",
            body: location
        }).then(function(response){
            console.log('success');
        }).then(function(data){
    
        }).catch(function(error){
            console.log(error);
        });
    }
});
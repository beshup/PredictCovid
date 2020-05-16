var btn = document.getElementById('testbtn');
btn.addEventListener('click', () => {
    fetch('/storePastCovidTweets', {
        method: "POST",
        body: "not doing anything with this yet, will have results"
    }).then(function(response){
        console.log('success');
    }).then(function(data){

    }).catch(function(error){
        console.log(error);
    });
});
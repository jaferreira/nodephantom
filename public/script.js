document.getElementById('myButton').onclick = function(e){
    
$.ajax({
    
    datatype: "json", // expecting JSON to be returned

    success: function (result) {
        console.log(result);
        if(result.status == 200){
            self.isEditMode(!self.isEditMode());
        }
    },
    error: function(result){
        console.log(result);
    }
});
}

document.getElementById('scrapButton').onclick = function(e){
    e.preventDefault();

    var teamName = document.getElementById('scrapTeam').value;
    var resultInput = document.getElementById('result');

    resultInput.innerText = '';

    var xhr = new XMLHttpRequest();

    xhr.open('POST', '/scrap');
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.responseType = 'json';

    xhr.onload = function() {
        // alert(xhr.response);
        resultInput.innerText = JSON.stringify(xhr.response, null, 2);
    };

    xhr.send(JSON.stringify({ team: teamName}));
}

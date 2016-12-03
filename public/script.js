document.getElementById('myButton').onclick = function(e){
    e.preventDefault();

    var xhr = new XMLHttpRequest();

    xhr.open('POST', '/add');
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.responseType = 'json';

    xhr.onload = function() {
        alert(xhr.response);
    };

    xhr.send(JSON.stringify({ a: 1 , b: 2}));
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

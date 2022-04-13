const proNumMarker = "!#number!"
const titleMarker = "!#title!";
const textMarker = "!#text!";
const answMarker = "!#answ!";
const rightAnswMarker = "!#rightAnsw!";
const colorMarker = "!#color!";
const tofanswMarker = "!#tofans!"
const resMarker = "!#result!"

var problemsAmount = 0;

const cardHtml = `
    <div class="card problem-card">
        <div class="card-header">
            Задача ` + proNumMarker + `
        </div>
        <div class="card-body">
            <h5 class="card-title">` + titleMarker + `</h5>
            <p class="card-text">
                ` + textMarker + `
            </p>
            <div class="input-group answ-input">
                <input type="text" class="form-control" id="answ-` + proNumMarker + `-form" placeholder="Ответ" value="` + answMarker + `" oninput="checkState(this.id, this.value)">
                <button class="btn btn-outline-` + colorMarker + `" type="button" id="answ-` + proNumMarker + `-btn" onclick="saveAnsw(this.id)">Сохранить</button>
            </div>
        </div>
    </div>
`
const fcardHtml = `
    <div class="card problem-card">
        <div class="card-header">
            Задача ` + proNumMarker + `
        </div>
        <div class="card-body">
            <h5 class="card-title">` + titleMarker + `</h5>
            <p class="card-text">
                ` + textMarker + `
            </p>
            <div class="fansw-input">
                <input type="text" class="form-control answ-` + tofanswMarker + `" id="answ-` + proNumMarker + `-form" placeholder="Ответ" value="` + answMarker + `" disabled>
                <input type="text" class="form-control right-answ" id="right-answ-` + proNumMarker + `-form" placeholder="Ответ" value="` + rightAnswMarker + `" disabled>
            </div
        </div>
    </div>
`
const finishBtnHtml = `
    <button class="btn btn-outline-primary btn-finish" onclick="finishHim()">Завершить</button>
`
const exitBtnHtml = `
    <a class="btn btn-outline-primary btn-finish" href="/">Выйти</a>
`
const resCardHtml = `
    <div class="card">
        <div class="card-body res-card-body">
            <div class="res-proc">` + resMarker + `</div>
            <div class="res-count">` + resMarker + `</div>
            <div class="res-time">` + resMarker + `</div>
        </div>
    </div>
`

function compareAnswers(answer, rightAnswer) {
    return parseFloat(answer) === parseFloat(rightAnswer);
}


function addCard(title, text) {
    var resHtml = cardHtml.replaceAll(proNumMarker, ++problemsAmount);
    resHtml = resHtml.replaceAll(titleMarker, title).replaceAll(textMarker, text);
    if (localStorage.getItem("answ"+problemsAmount) != null) {
        resHtml = resHtml.replaceAll(colorMarker, "success").replaceAll(answMarker, localStorage.getItem("answ"+problemsAmount));
    } else {
        resHtml = resHtml.replaceAll(colorMarker, "secondary").replaceAll(answMarker, "");
    }

    document.body.innerHTML += resHtml;
}

function addFCard(title, text, answer, rightAnswer) {
    var resHtml = fcardHtml.replaceAll(proNumMarker, ++problemsAmount);
    resHtml = resHtml.replaceAll(titleMarker, title).replaceAll(textMarker, text).replaceAll(answMarker, answer).replaceAll(rightAnswMarker, rightAnswer);

    if (compareAnswers(answer, rightAnswer)) {
        resHtml = resHtml.replaceAll(tofanswMarker, "green");
    } else {
        resHtml= resHtml.replaceAll(tofanswMarker, "red");
    }

    document.body.innerHTML += resHtml;
}

function addProblems(problems) {
    if (localStorage.getItem("finished") === "true") {
        var answers = [];
        var rightCount = 0;
        for (var i = 0; i < problems.length; i++) {
            answers.push(localStorage.getItem("answ" + (i+1)));
            compareAnswers(answers[i], problems[i][3]) ? rightCount++ : null;
        }

        var timeSpent = parseInt(localStorage.getItem("finishTime")) - parseInt(localStorage.getItem("startTime"));

        document.getElementsByClassName("container-fluid")[0].innerHTML += exitBtnHtml;
        document.body.innerHTML += resCardHtml
            .replace(resMarker, 100*rightCount/problems.length + "%")
            .replace(resMarker, rightCount + "/" + problems.length)
            .replace(resMarker, "Время: " + parseInt(timeSpent/1000) + "с");
        for (var i = 0; i < problems.length; i++) {
            addFCard(problems[i][1], problems[i][2], answers[i], problems[i][3]);
        }
    } else {
        document.getElementsByClassName("container-fluid")[0].innerHTML += finishBtnHtml;
        for (var i = 0; i < problems.length; i++) {
            addCard(problems[i][1], problems[i][2]);
        }
    }
}

function saveAnsw(btn_id) {
    var id = btn_id.split()[0].split("-")[1];
    var inp = document.getElementById("answ-" + id + "-form");

    localStorage.setItem('answ'+id, inp.value);
    checkState("answ-" + id + "-form", inp.value);
}

function checkState(inp_id, inp_value) {
    var id = inp_id.split()[0].split("-")[1];
    var btn = document.getElementById("answ-" + id + "-btn");

    btn.classList.remove('btn-outline-secondary');
    btn.classList.remove('btn-outline-danger');
    btn.classList.remove('btn-outline-success');

    if (inp_value === localStorage.getItem("answ" + id))
        btn.classList.add('btn-outline-success');
    else
        btn.classList.add('btn-outline-danger');
}

function finishHim(withoutConf = false) {
    console.log(withoutConf)
    if (withoutConf || confirm("Вы уверены, что хотите завершить тест?")) {
        localStorage.setItem("finished", true);
        localStorage.setItem("finishTime", Date.now());
        location.reload();
    }
}

if (localStorage.getItem("startTime") === null)
    localStorage.setItem("startTime", Date.now());

if ((Date.now() - parseInt(localStorage.getItem("startTime")) >= 10000) && (localStorage.getItem("finished") != "true"))
    finishHim(true);

fetch('http://127.0.0.1:5000/api/problems/1')
  .then(response => response.json())
  .then(data => data.status == 200 ? addProblems(data.result) : alert("Error: Status " + data.status));

// Focus div based on nav button click
function reveal(pick) {
    document.getElementById('home').setAttribute("class", "hidden")
    document.getElementById('single').setAttribute("class", "hidden")
    document.getElementById('multi').setAttribute("class", "hidden")
    document.getElementById('guess').setAttribute("class", "hidden")
    document.getElementById(pick).setAttribute("class", "active")
}
// Flip one coin and show coin image to match result when button clicked
function flipCoin() {
    document.getElementById("side").innerHTML = "Flipped";
    document.getElementById("singleflip").src = "./assets/img/coin.png";
    fetch("http://localhost:5000/app/flip/")
        .then((response) => response.json())
        .then(function(result) {
            document.getElementById("singleflip").src = "./assets/img/"+result.flip+".png";
            document.getElementById("side").innerHTML = "Result: " + result.flip + "!";
        })
}

// Flip multiple coins and show coin images in table as well as summary results
async function flipCoins(event) {
    event.preventDefault();
    const formEvent = event.currentTarget
    const url = document.baseURI+"app/flips/";
    try {
        const formData = new FormData(formEvent)
        const flips = await sendData({ url, formData});
        console.log(flips);

        let coins = "";

        for (var i=0;i<flips.summary.heads;i++) {
            coins+="<img class='smallcoin' src='./assets/img/heads.png'>"
        }
        for (var i=0;i<flips.summary.tails;i++) {
            coins+="<img class='smallcoin' src='./assets/img/tails.png'>"
        }
        document.getElementById("heads").innerHTML="Heads: "+flips.summary.heads;
        document.getElementById("tails").innerHTML="Tails: "+flips.summary.tails;
        document.getElementById("resultTable").innerHTML=coins;

    } catch(error) {
        console.log(error);
    }

}
// Guess a flip by clicking either heads or tails button
async function guessFlip(event) {
    event.preventDefault();
    let guess = event.submitter.getAttribute("value")
    const formEvent = event.currentTarget
    const url = document.baseURI+"app/flip/call/";

    try {
        const formData = new FormData(formEvent)
        formData.append("guess",guess)
        const result = await sendData({ url, formData});

        document.getElementById("call").innerHTML="Call: "+result.call;
        document.getElementById("callimg").setAttribute("src", "./assets/img/"+result.call+".png")
        document.getElementById("flip").innerHTML="Flip: "+result.flip;
        document.getElementById("flipimg").setAttribute("src", "./assets/img/"+result.flip+".png")
        document.getElementById("result").innerHTML="Result: "+result.result;

    } catch(error) {
        console.log(error);
    }
}

async function sendData({url, formData}) {
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJson = JSON.stringify(plainFormData);
    console.log(formDataJson);

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: formDataJson
    }
    const response = await fetch(url, options);
    return response.json();
}
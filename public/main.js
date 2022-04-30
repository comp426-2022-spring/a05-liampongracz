const { response } = require("express")

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
function flipCoins() {
    
}
// Enter number and press button to activate coin flip series

// Guess a flip by clicking either heads or tails button

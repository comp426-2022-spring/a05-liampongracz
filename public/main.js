// Focus div based on nav button click
function reveal(pick) {
    document.getElementById('home').setAttribute("class", "hidden")
    document.getElementById('single').setAttribute("class", "hidden")
    document.getElementById('multi').setAttribute("class", "hidden")
    document.getElementById('guess').setAttribute("class", "hidden")
    document.getElementById(pick).setAttribute("class", "active")

}
// Flip one coin and show coin image to match result when button clicked
function flipCoin(event) {
    document.getElementById("side").innerHTML = "Flipped"
    document.getElementById("singleflip").src = "./assets/img/coin.png";
    fetch("http://localhost:5000/app/flip/")
        .then(res => res.json())
        .then(data => {
            const result = data.flip.toString();
            setTimeout(function() {
                document.getElementById("singleflip").src = "./assets/img/"+result+".png";
                document.getElementById("side").innerHTML = "Result: " + result + "!";
            }, 100);
        })
}

// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

// Guess a flip by clicking either heads or tails button

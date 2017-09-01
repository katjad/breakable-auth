const token = document.getElementById("token").innerText
console.log("token", token)
localStorage.setItem("jwt", token)
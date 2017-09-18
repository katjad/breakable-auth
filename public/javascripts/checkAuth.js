const button = document.getElementById('viewItems')
button.addEventListener("click", function(e){
    getPageWithAuth('/items')    
})

function getPageWithAuth(url){
    const req = new XMLHttpRequest()
    req.open('GET', url, true)
    req.setRequestHeader('authorization', localStorage.getItem("jwt"))
    req.onload = function(e){
        console.log(req.response)
        document.body.innerHTML = req.response
    }
    req.send()    
}
const button = document.getElementById('viewItems')
button.addEventListener("click", function(e){
    getPageWithAuth('/items')    
})

function getPageWithAuth(url){
    const req = new XMLHttpRequest()
    req.open('GET', url, true)
    req.setRequestHeader('authorization', localStorage.getItem("jwt"))
    req.onload = function(e){
        if(req.response == "Unauthorized"){
             window.location.href = "/unauthorized"
        }
        document.body.innerHTML = req.response        
    }
    req.send() 
    window.onpopstate = function(event) {
      window.location.href = "/";
    }; 
    window.history.pushState({"pageInfo": {"title": "Items"}}, "Items", "/items")  
}
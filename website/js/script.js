window.onload = function() {
    document.getElementById('logoutbtn').addEventListener("click", logOut)
};

const validateEmail = () => {
    let valid = String(document.getElementById("submitbtn").innerHTML).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(!valid)
    {
        // Front end, email not valid alert
        console.log("Not valid");
    }
    return valid;
};

function logOut() 
{
    fetch("http://localhost:4000/logout")
}
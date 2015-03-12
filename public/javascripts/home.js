function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
function loadUsername() {
	var user = getCookie("username");
    if (user != null) {
	   document.getElementById("lbltopmid").innerHTML = user;
    } else {
       document.getElementById("lbltopmid").innerHTML = "Not logged in.";
    }
}

// function deleteCookies() {
//     document.cookie = null;
//     loadUsername();
// }
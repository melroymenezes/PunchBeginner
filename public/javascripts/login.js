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

function checkError() {
	var errMessage = getCookie('error');
	if (errMessage == "not exist"){
		document.getElementById("errMessage").innerHTML = 
			"User does not exist or other error.";
	} else if (errMessage == "incorrect"){
		document.getElementById("errMessage").innerHTML = 
		"Incorrect password";
	}
}
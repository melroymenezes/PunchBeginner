function loadUser(currentUser) {
	if (currentUser != "Not logged in.") {
		document.getElementById("btnLogin").disabled=true;
		document.getElementById("btnSignup").disabled=true;
	} else {
		document.getElementById("btnLogin").disabled=false;
		document.getElementById("btnSignup").disabled=false;
	}
}
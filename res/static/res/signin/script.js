function onSignIn(googleUser) {
    console.log("Google sign in success!");
    var id_token = googleUser.getAuthResponse().id_token;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/api/google-token-sign-in');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if(xhr.responseText === "verified") {
            document.cookie = "idtoken=" + id_token + "; expires=2038-01-19 04:14:07";
        }
    };
    xhr.send('idtoken=' + id_token);
  }
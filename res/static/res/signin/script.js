function onSignIn(googleUser) {
    console.log("Google sign in success!");
    var id_token = googleUser.getAuthResponse().id_token;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/api/google-token-sign-in');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if(xhr.status === 200) {
            var userDetails = JSON.parse(xhr.responseText);
            document.cookie = "username=" + userDetails["user"]["user-name"] + "; expires=2099-12-30 00:00:00";
            document.cookie = "authtoken=" + userDetails["user"]["auth-token"] + "; expires=2099-12-30 00:00:00";

            window.location.replace("http://localhost/");
        }
    };
    xhr.send('idtoken=' + id_token);
  }
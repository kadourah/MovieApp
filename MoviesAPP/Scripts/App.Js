$('document').ready(function () {
    var content = $('.content');
    var loadingSpinner = $('#loading');
    content.css('display', 'block');
    loadingSpinner.css('display', 'none');

    var userProfile;
    var apiUrl = 'http://localhost:35925/api';
    var requestedScopes = 'openid profile read:messages write:messages delete:messages';

    var webAuth = new auth0.WebAuth({
        domain: AUTH0_DOMAIN,
        clientID: AUTH0_CLIENT_ID,
        redirectUri: AUTH0_CALLBACK_URL,
        audience: AUTH0_AUDIENCE,
        responseType: 'token id_token',
        scope: requestedScopes,
        leeway: 60
    });

    var homeView = $('#home-view');
    var profileView = $('#profile-view');
    var pingView = $('#ping-view');
    var adminView = $('#admin-view');

    // buttons and event listeners
    var loginBtn = $('#qsLoginBtn');
    var logoutBtn = $('#qsLogoutBtn');

    var homeViewBtn = $('#btn-home-view');
    var profileViewBtn = $('#btn-profile-view');
    var pingViewBtn = $('#btn-ping-view');
    var adminViewBtn = $('#btn-admin-view');

    var pingPublic = $('#btn-ping-public');
    var pingPrivate = $('#btn-ping-private');
    var pingPrivateScoped = $('#btn-ping-private-scoped');
    var pingAdmin = $('#btn-ping-admin');
    //
    var getMoviesScoped = $('#btn-get-movies');
    var updateMoviesScoped = $('#btn-update-movie');
    var deleteMoviesScoped = $('#btn-delete-movie');
    

    var callPrivateMessage = $('#call-private-message');
    var pingMessage = $('#ping-message');
    var adminMessage = $('#admin-message');

    pingPublic.click(function () {
        
        callAPI('/movies', false, 'GET', function (err, message) {
            if (err) {
                alert(err.responseText);
                return;
            }
            console.log(result);
            pingMessage.text(message);
        });
    });

    pingPrivate.click(function () {
        callAPI('/Movies', true, 'GET', function (err, message) {
            if (err) {
                alert(err.responseText);
                return;
            }
            console.log(message);
            pingMessage.text(message);
        });
    });

    pingPrivateScoped.click(function () {
        callAPI('/movies/private-scoped', true, 'GET', function (err, message) {
            if (err) {
                alert(err);
                return;
            }
            pingMessage.text(message);
        });
    });

    getMoviesScoped.click(function () {
        
        refershMovieList();
    });

    

    $('body').on('click', deleteMoviesScoped, function () {
        console.log('delete');
        //  var id = btn.data('data-id');
        var movieId = event.target.getAttribute("data-id");
        
        var accessToken = localStorage.getItem('access_token');

        var headers;
        if (accessToken) {
            headers = {
                Authorization: 'Bearer ' + accessToken
            };
        }
        if (movieId != null)
        {
            console.log('delete2');
            $.ajax({
                url: "/api/movies/" + movieId,
                type: 'DELETE',
                headers: headers,
                contentType:
                   "application/json;charset=utf-8",

                success: function (movie) {
                    movieAddSuccess(movie);
                },
                error: function (request, message, error) {
                    handleException(request, message, error);
                }
            });
    }
    });

    
    pingAdmin.click(function () {
        callAPI('/admin', true, 'POST', function (err, message) {
            if (err) {
                alert(err);
                return;
            }
            adminMessage.text(message);
        });
    });

    updateMoviesScoped.click(function () {
        
        // Build product object from inputs
        movie = new Object();
        movie.Name = $("#movieName").val();
        movieAdd(movie);
  
    });

    function refershMovieList()
    {
        callAPI('/movies/GetAll', true, 'GET', function (err, message) {
            if (err) {
                pingMessage.css('color', 'red');
                pingMessage.text('You dont have permissions to view this');

                //alert(err);
                return;
            }
            
            movieListSuccess(message)
            //  pingMessage.text(message);
        });

}
    

    loginBtn.click(login);
    logoutBtn.click(logout);

    homeViewBtn.click(function () {
        homeView.css('display', 'inline-block');
        profileView.css('display', 'none');
        pingView.css('display', 'none');
        adminView.css('display', 'none');
    });

    profileViewBtn.click(function () {
        homeView.css('display', 'none');
        pingView.css('display', 'none');
        adminView.css('display', 'none');
        profileView.css('display', 'inline-block');
        getProfile();
    });

    pingViewBtn.click(function () {
        homeView.css('display', 'none');
        profileView.css('display', 'none');
        adminView.css('display', 'none');
        pingView.css('display', 'inline-block');
    });

    adminViewBtn.click(function () {
        homeView.css('display', 'none');
        profileView.css('display', 'none');
        pingView.css('display', 'none');
        adminView.css('display', 'inline-block');
    });

    function login() {
        webAuth.authorize();
    }

    function setSession(authResult) {
        // Set the time that the access token will expire at
        var expiresAt = JSON.stringify(
          authResult.expiresIn * 1000 + new Date().getTime()
        );

        // If there is a value on the `scope` param from the authResult,
        // use it to set scopes in the session for the user. Otherwise
        // use the scopes as requested. If no scopes were requested,
        // set it to nothing
        const scopes = authResult.scope || requestedScopes || '';

        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        localStorage.setItem('scopes', JSON.stringify(scopes));
    }

    function logout() {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('scopes');
        pingMessage.css('display', 'none');
        adminMessage.css('display', 'none');
        displayButtons();
    }

    function isAuthenticated() {
        // Check whether the current time is past the
        // access token's expiry time
        var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

    function displayButtons() {
        var loginStatus = $('.container h4');
        if (isAuthenticated()) {
            loginBtn.css('display', 'none');
            logoutBtn.css('display', 'inline-block');
            profileViewBtn.css('display', 'inline-block');
            pingViewBtn.css('display', 'inline-block');
            callPrivateMessage.css('display', 'none');
            loginStatus.text(
              'You are logged in! You can now send authenticated requests to your server.'
            );
        } else {
            homeView.css('display', 'inline-block');
            loginBtn.css('display', 'inline-block');
            logoutBtn.css('display', 'none');
            profileViewBtn.css('display', 'none');
            profileView.css('display', 'none');
            pingView.css('display', 'none');
            pingViewBtn.css('display', 'none');
            adminView.css('display', 'none');
            callPrivateMessage.css('display', 'block');
            loginStatus.text('You are not logged in! Please log in to continue.');
        }
        if (!isAuthenticated() || !userHasScopes(['write:messages'])) {
            adminViewBtn.css('display', 'none');
        } else {
            adminViewBtn.css('display', 'inline-block');
        }
    }

    function getProfile() {
        if (!userProfile) {
            var accessToken = localStorage.getItem('access_token');

            if (!accessToken) {
                console.log('Access token must exist to fetch profile');
            }

            webAuth.client.userInfo(accessToken, function (err, profile) {
                if (profile) {
                    userProfile = profile;
                    displayProfile();
                }
            });
        } else {
            displayProfile();
        }
    }

    function displayProfile() {
        // display the profile
        $('#profile-view .nickname').text(userProfile.nickname);
        $('#profile-view .full-profile').text(JSON.stringify(userProfile, null, 2));
        $('#profile-view img').attr('src', userProfile.picture);
    }

    function handleAuthentication() {
        webAuth.parseHash(function (err, authResult) {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                setSession(authResult);
                loginBtn.css('display', 'none');
                homeView.css('display', 'inline-block');
            } else if (err) {
                homeView.css('display', 'inline-block');
                console.log(err);
                alert(
                  'Error: ' + err.error + '. Check the console for further details.'
                );
            }
            displayButtons();
        });
    }

    function userHasScopes(scopes) {
        var savedScopes = JSON.parse(localStorage.getItem('scopes'));
        if (!savedScopes) return false;
        var grantedScopes = savedScopes.split(' ');
        for (var i = 0; i < scopes.length; i++) {
            if (grantedScopes.indexOf(scopes[i]) < 0) {
                return false;
            }
        }
        return true;
    }

    handleAuthentication();

    function callAPI(endpoint, secured, method, cb) {
        console.log(endpoint);
        var url = apiUrl + endpoint;
        var accessToken = localStorage.getItem('access_token');

        var headers;
        if (secured && accessToken) {
            headers = { Authorization: 'Bearer ' + accessToken };
        }

        $.ajax({
            method: method,
            url: url,
            headers: headers
        })
          .done(function (result) {
              console.log(result);
              cb(null, result);
          })
          .fail(function (err) {
              cb(err);
          });
    }

    displayButtons();

    function movieListSuccess(movies) {
        // Iterate over the collection of data
        $("#movieTable").empty();
        $.each(movies, function (index, movie) {
            // Add a row to the Product table
            movieAddRow(movie);
        });
    }


    function movieAddRow(movie) {
        // Check if <tbody> tag exists, add one if not
        if ($("#movieTable tbody").length == 0) {
            $("#movieTable").append("<tbody></tbody>");
        }
        // Append row to <table>
        $("#movieTable tbody").append(
          movieBuildTableRow(movie));
    }

    function movieBuildTableRow(movie) {
        var ret =
          "<tr>" +
           "<td>" + movie.Id + "</td>" +
           "<td>" + movie.Name + "</td>"
            + "<td>" + movie.DateCreated + "</td>" 
            + "<td>  <button type='button' id='btn-delete-movie' class='btn btn-primary' "

            + "data-id='" + movie.Id + "'" +
            " >Delete Movie </button> </td>"

          + "</tr>";
        return ret;
    }

    
    function handleException(request, message, error)
    {
        var msg = "";
        msg += "Code: " + request.status + "\n";
        msg += "Text: " + request.statusText + "\n";
        if (request.responseJSON != null) {
            msg += "Message" +
                request.responseJSON.Message + "\n";
        }
        alert(msg);
    }

    function updateClick() {
        
        // Build product object from inputs
        movie = new Object();
        movie.Name = $("#movieName").val();
        movieAdd(movie)

        /*if ($("#updateButton").text().trim() ==
                  "Add") {
            movieAdd(movie.Name);
        }*/
    }

    function movieAdd(movieName) {

        var accessToken = localStorage.getItem('access_token');

        var headers;
        if (accessToken) {
            headers = {
                Authorization: 'Bearer ' + accessToken
            };
        }

        $.ajax({
            url: "/api/movies",
            type: 'POST',
            headers: headers,
            contentType:
               "application/json;charset=utf-8",
            data: JSON.stringify(movieName),
            success: function (movie) {
                movieAddSuccess(movie);
            },
            error: function (request, message, error) {
                handleException(request, message, error);
            }
        });
    };

   
    
   

    function movieAddSuccess(product) {
        refershMovieList();
        // movieAddRow(product);
        formClear();
    }

    function formClear() {
        $("#movieName").val("");
     
    }
    function addClick() {
        formClear();
    }
});

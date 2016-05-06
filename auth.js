
var OAUTH2_CLIENT_ID = "314088901576-ok4c0k333gfgqegkskpmn1fmsjha18cg.apps.googleusercontent.com";
var OAUTH2_SCOPES = [
    "https://www.googleapis.com/auth/youtube"
];

googleApiClientReady = function() {
    gapi.auth.init(function() {
        window.setTimeout(checkAuth, 1);
    });
}

function checkAuth() {
    gapi.auth.authorize({
        client_id: OAUTH2_CLIENT_ID,
        scope: OAUTH2_SCOPES,
        immediate: true
    }, handleAuthResult);
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        // Authorization was successful. Hide authorization prompts and show
        // content that should be visible after authorization succeeds.
        console.log("entrou!");
        loadAPIClientInterfaces();
    } else {
        console.log("Não entrou o___O");
        // Make the #login-link clickable. Attempt a non-immediate OAuth 2.0
        // client flow. The current function is called when that flow completes.
        $('#login-link').click(function() {
            gapi.auth.authorize({
                client_id: OAUTH2_CLIENT_ID,
                scope: OAUTH2_SCOPES,
                immediate: false
            }, handleAuthResult);
        });
    }
}

function loadAPIClientInterfaces() {
    gapi.client.load('youtube', 'v3', function() {
        gapi.client.load('youtubeAnalytics', 'v1', function() {
            getUserInfo();
            getVideos();
        });
    });
}

function getUserInfo() {
    var request = gapi.client.youtube.channels.list({
        mine: true,
        part: 'snippet'
    });

    request.execute(function(response) {
        if ('error' in response) {
            console.log(response.error.message);
        } else {
            var data = response.items[0].snippet;
            var username = data.title;
            var avatar = data.thumbnails.high.url; // default, high, medium
            $("#nome").text(username);
            $("#avatar").attr("src", avatar);
        }
    });
}

function getVideos() {
    var request = gapi.client.youtube.videos.list({
        mine: true,
        chart: 'mostPopular',
        maxResults: 20,
        part: 'id,snippet'
    });

    request.execute(function(response) {
        if ('error' in response) {
            console.log(response.error.message);
        } else {
            var str = "";
            for (var i in response.items) {
                var video = response.items[i].snippet;
                str += "<div>";
                str += "title: ";
                str += video.title;
                str += " | published at: ";
                str += video.publishedAt;
                str += "</div>";
                $("#videos").html(str);
            }
        }
    });
}

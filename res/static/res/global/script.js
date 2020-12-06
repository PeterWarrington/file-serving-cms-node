window.onload = (ev) => {
    for (i=0; i < document.getElementsByClassName("fa-search").length; i++) {
        document.getElementsByClassName("fa-search").item(i).onclick = (event) => {
            searchAction(event);
        }
    }

    for (i=0; i < document.getElementsByClassName("review-details").length; i++) {
        var review_detail = document.getElementsByClassName("review-details").item(i);
        for (j=0; j < review_detail.getElementsByClassName("btn").length; j++) {
            review_detail.getElementsByClassName("btn").item(j).onclick = (event) => {
                likeBtnClick(event);
            }
        }
    }

    for (i=0; i < document.getElementsByClassName("searchInput").length; i++) {
        document.getElementsByClassName("searchInput").item(i).onkeyup = (event) => {
            searchEnterDetect(event);
        }
    }

    if (document.getElementById("sign-out-btn") !== null)
        document.getElementById("sign-out-btn").onclick = signOut;

    if (document.getElementById("sign-in-btn") !== null)
        document.getElementById("sign-in-btn").onclick = signIn;
    
    reviewReportBtns = document.getElementsByClassName("review-report-btn");
    for (i=0; i < reviewReportBtns.length; i++) {
        reviewReportBtns[i].onclick = (event) => {
            reviewId = getReviewId(event);
            $('#report-modal').modal('show');
            document.getElementById("report-submit").onclick = (event) => {reportSubmit(event, reviewId)};
        }
    };
}

function reportSubmit(event, reviewId) {
    var url = "/api/report_review_or_object";
    var reportText = document.getElementById("report-detail-textarea").value;
    var reqParams = "reportSeverity=0&reportObjectType=review&reportObjectId="+ reviewId + "&reportText=" + reportText;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if(xhr.status === 200) {
            $('#report-modal').modal('hide');
            document.getElementsByClassName("toast-body")[0].innerHTML = "Report succesfully submitted.";
            $('.toast').toast('show');
        } else {
            document.getElementsByClassName("toast-body")[0].innerHTML = "There was a problem submitting your report.";
            $('.toast').toast('show');
        }
    };
    xhr.send(reqParams);
}

function searchAction(event) {
    searchInput = event.srcElement.parentElement.getElementsByClassName("searchInput")[0];
    document.location.href = "/search?q=" + searchInput.value;
}

function searchEnterDetect(event) {
    if (event.key === "Enter") {
        searchAction(event);
    }
}

function likeBtnClick(event) {
    try {
        if (event.srcElement.classList.contains("not-logged-in")) { // Not logged in
            document.getElementsByClassName("toast-body")[0].innerHTML = "You must <a href='/signin?referer=" + window.location.pathname + "'>sign in</a> to like/dislike reviews.";
            $('.toast').toast('show');
        } else if (!event.srcElement.classList.contains("active")) { // Hasn't already liked (need to like review)
            likeOrDislikeReview(event);
        } else if (event.srcElement.classList.contains("active")) { // has already been liked (nned to remove like)
            removeLike(event);
        }
    } catch (err) {
        document.getElementsByClassName("toast-body")[0].innerHTML = "Unable to (un)like/dislike this review. Error code: REVIEW_LIKE_JS_" + err.name.toUpperCase();
        $('.toast').toast('show');
        throw err;
    }
}

function getReviewId(event) {
    var reviewId = event.srcElement.closest(".review").id;
    reviewId = reviewId.split("-")[1]; /// e.g: 'review-1' -> '1'

    return reviewId;
}

function getLikeAmmount(event) {
    var likeThumbsUpOrDownClassType = event.srcElement.closest("button").querySelector("i").className; // get class names of i element

    var likeAmmount;
    if (likeThumbsUpOrDownClassType.indexOf("fa-thumbs-up") != -1) {
        likeAmmount = 1;
    } else if (likeThumbsUpOrDownClassType.indexOf("fa-thumbs-down") != -1) {
        likeAmmount = -1;
    } else { // No thumb-up or thimb-down class
        document.getElementsByClassName("toast-body").innerHTML = "Unable to (un)like/dislike review. Error code: NO_THUMB_CLASS";
        $('.toast').toast('show');
        throw Error;
    }

    return likeAmmount;
}

function likeOrDislikeReview(event) {
    var reviewId = getReviewId(event);
    var likeAmmount = getLikeAmmount(event);

    // Check if need to remove existing like first (e.g: to like a comment, might need to remove the existing dislike)
    var oppositeButtonClass;
    if (likeAmmount == 1)
        oppositeButtonClass = ".fa-thumbs-down";
    else if (likeAmmount == -1)
        oppositeButtonClass = ".fa-thumbs-up";

    if (event.srcElement.closest(".review-details").querySelector(oppositeButtonClass).parentElement.classList.contains("active")) {
        event.srcElement.closest(".review-details").querySelector(oppositeButtonClass).parentElement.click(); // Trigger unlike
    } 

    // Send request

    var url = "/api/attempt_review_like_or_dislike.json?reviewId=" + reviewId + "&likeAmmount=" + likeAmmount;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            // darken like button
            event.srcElement.closest("button").className = "btn btn-secondary btn-sm active";
            // Increment/decrement like count
            event.srcElement.closest(".review-details").querySelector(".like-count").innerHTML = 
                parseInt(event.srcElement.closest(".review-details").querySelector(".like-count").innerHTML) + likeAmmount;
        } else if (xmlHttp.readyState == 4) {
            var errorText;
            try {
                var errorInfo = JSON.parse(xmlHttp.responseText);
                if (errorInfo.internalErrorCode == "REVIEW_LIKE_CONFLICT") {
                    errorText = "You have already liked/disliked this review."
                } else {
                    errorText = "Unable to like/dislike this review. Error code: " + errorInfo.internalErrorCode;
                }
            } catch (err) { // Could not parse JSON, fall back on just the HTTP status
                errorText = "Unable to like/dislike this review. Error code: REVIEW_LIKE_HTTP_" + xmlHttp.status;
            }

            document.getElementsByClassName("toast-body")[0].innerHTML = errorText;
            $('.toast').toast('show');
        }
    }

    xmlHttp.open("POST", url, true); // true for asynchronous 
    xmlHttp.send(null);
} 

function removeLike(event) {
    var reviewId = getReviewId(event);
    var likeAmmount = getLikeAmmount(event);

    var url = "/api/attempt_remove_review_like_or_dislike.json?reviewId=" + reviewId;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            // lighten like button
            event.srcElement.closest("button").className = "btn btn-outline-secondary btn-sm";
            // Increment/decrement like count
            event.srcElement.closest(".review-details").querySelector(".like-count").innerHTML = 
                parseInt(event.srcElement.closest(".review-details").querySelector(".like-count").innerHTML) - likeAmmount;
        } else if (xmlHttp.readyState == 4) {
            var errorText;
            try {
                var errorInfo = JSON.parse(xmlHttp.responseText);
                errorText = "Unable to like/dislike this review. Error code: " + errorInfo.internalErrorCode;
            } catch (err) { // Could not parse JSON, fall back on just the HTTP status
                errorText = "Unable to like/dislike this review. Error code: REVIEW_LIKE_HTTP_" + xmlHttp.status;
            }

            document.getElementsByClassName("toast-body")[0].innerHTML = errorText;
            $('.toast').toast('show');
        }
    }

    xmlHttp.open("POST", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

function signOut(event) {
    window.location.replace("/signout?referer=" + window.location.href);
}

function signIn(event) {
    window.location.replace("/signin?referer=" + window.location.href);
}
function checkIfShouldRemoveButton() { // remove button if at end of reviews
    if (document.getElementById("end-reviews") != undefined) document.getElementById("more-review-btn").remove();
}

function loadMoreReviews() {
    objectID = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1] // Get last portion of url path (the object id)

    alreadyDoneReviewIds = [];
    reviewElements = document.getElementsByClassName("review");
    for (i=0; i < reviewElements.length; i++) {
        alreadyDoneReviewIds.push(reviewElements[i].id.split("review-")[1]); // get id for each review, e.g id="review-[id]", get stuff after 'review-' to get '[id]'
    }
    alreadyDoneReviewIds = alreadyDoneReviewIds.join(",");

    accessTime = reviewElements[0].getAttribute("access-date");

    var url = "/api/reviews_from_criteria.html?objectId=" + objectID + "&alreadyDoneReviewIds=" + alreadyDoneReviewIds + "&accessTime=" + accessTime;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            document.getElementById("more-review-btn").insertAdjacentHTML('beforebegin', xmlHttp.responseText);
        checkIfShouldRemoveButton();
    }

    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

window.addEventListener("load", async (event) => {
    document.getElementById("more-review-btn").addEventListener('click', function(event) {
        loadMoreReviews();
    });

    window.onscroll(null);
});
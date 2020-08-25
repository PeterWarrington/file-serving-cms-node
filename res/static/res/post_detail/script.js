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

function sendReview(reviewText, reviewRating) {
    reviewObjectId = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]; // Get last portion of url path (the object id)

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reviewSuccess(reviewText, reviewRating);
        } else if (this.readyState == 4 && this.status != 200) {
            var errorInfo = JSON.parse(xhttp.responseText);
            if (errorInfo.internalErrorCode == "REVIEW_ALREADY_WRITTEN") {
                document.getElementsByClassName("toast-body")[0].innerHTML = "You have already submitted a review for this post.";
                $('.toast').toast('show');
            } else {
                document.getElementsByClassName("toast-body")[0].innerHTML = "Unable to submit review. Error code: " + errorInfo.internalErrorCode;
                $('.toast').toast('show');
            }
        }
    };
    xhttp.open("POST", "/api/submit_review", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("reviewRating=" + reviewRating + "&reviewText=" + reviewText + "&reviewObjectId=" + reviewObjectId);
}

function reviewSuccess(reviewText, reviewRating) {
    document.getElementById("template-review-user").innerHTML = getCookie("username");
    document.getElementById("template-review-date").innerHTML = new Date().toISOString().slice(0, 19).replace('T', ' ').split(" ")[0];
    document.getElementById("template-review-text").innerHTML = reviewText;
    document.getElementById("template-review").style = "display: block";

    starCountHTML = "";

    var i = 1;
    while (i <= Math.floor(reviewRating)) {
        starCountHTML += '<i class="fas fa-star"></i>';
        i++;
    } 
    i -= 1;

    while (i < 5) {
        starCountHTML += '<i class="far fa-star"></i>';
        i++;
    }

    document.getElementById("template-review-star-count").innerHTML = starCountHTML;
}

window.addEventListener("load", async (event) => {
    try {
        document.getElementById("more-review-btn").addEventListener('click', function(event) {
            loadMoreReviews();
        });
    } catch {};

    // Enable textarea auto-expand for review
    textarea = document.getElementById("review-text");
    var heightLimit = 250;
    textarea.oninput = function() {
        textarea.style.height = ""; /* Reset the height*/
        textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + "px";
    };
      
    // Handle star rating selection and effects
    inputStarBtns = document.getElementsByClassName("input-star-btn");
    for (i=0; i<inputStarBtns.length; i++) {
        starBtnOuter = inputStarBtns[i];

        starBtnOuter.onmouseover =  function(event) {
            if (event.srcElement.id == "") { // mousing over the icon inside the button
                event.srcElement.id = event.srcElement.parentElement.id;
            }

            starBtnNumberOuter = parseInt(event.srcElement.id.slice(-1)); // e.g "input-star-btn-1" -> "1" -> 1

            for (i=0; i<inputStarBtns.length; i++) {
                starBtnInner = inputStarBtns[i];
                starBtnNumberInner = parseInt(starBtnInner.id.slice(-1));

                if (starBtnNumberInner <= starBtnNumberOuter) {
                    if (!starBtnInner.classList.contains("active")) {
                        starBtnInner.classList.add("active");
                    }
                }
            };
        };

        starBtnOuter.onmouseout = function(event) {
            if (event.srcElement.id == "") { // mousing over the icon inside the button
                event.srcElement.id = event.srcElement.parentElement.id;
            }

            starBtnNumberOuter = parseInt(event.srcElement.id.slice(-1));

            for (i=0; i<inputStarBtns.length; i++) {
                starBtnInner = inputStarBtns[i];
                starBtnNumberInner = parseInt(starBtnInner.id.slice(-1));

                if (starBtnNumberInner <= starBtnNumberOuter) {
                    if (starBtnInner.classList.contains("active")) {
                        starBtnInner.classList.remove("active");
                    }
                }
            };
        };

        starBtnOuter.addEventListener('click', function(event) {
            for (i=0; i<inputStarBtns.length; i++) {
                starBtnInner = inputStarBtns[i];
                starBtnNumberClicked = parseInt(event.srcElement.id.slice(-1));
                document.getElementById("star-rating-choice").value = starBtnNumberClicked

                starBtnInner.onmouseout = function(event) {
                    for (x=0; x<inputStarBtns.length; x++) {
                        starBtnNumberInner = parseInt(inputStarBtns[x].id.slice(-1));

                        if (starBtnNumberInner > starBtnNumberClicked) {
                            if (inputStarBtns[x].classList.contains("active")) {
                                inputStarBtns[x].classList.remove("active");
                            }
                        }
                    }
                };
            }
        });
    };

    document.getElementById("review-submit").addEventListener('click', function(event) {
        reviewText = document.getElementById("review-text").value;
        reviewRating = document.getElementById("star-rating-choice").value;

        if (reviewRating == null || reviewRating == "") {
            document.getElementsByClassName("toast-body")[0].innerHTML = "You must rate this post to submit a review.";
            $('.toast').toast('show');
        } else {
            sendReview(reviewText, reviewRating);
        }
    });

    window.onscroll(null);
});

// https://stackoverflow.com/a/21125098
function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
  }
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

    window.onscroll(null);
});
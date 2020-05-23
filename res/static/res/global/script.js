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
    if (event.srcElement.classList.contains("not-logged-in")) {
        $('.toast').toast('show');
    }
}
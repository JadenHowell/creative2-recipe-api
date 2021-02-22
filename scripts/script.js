const appID = "787856f6"
const appKey = "020846ca96ed5eeb743c9f110338159a"

//hits is going to be an array of objects
function presentHits(hits){
    let recipeList = "";
    for(let i = 0; i < hits.length; i ++){
        let recipe = hits[i]["recipe"];
        //console.log(recipe);
        let calories = recipe.calories / recipe.yield;
        let recURL = recipe.url;
        let imgSrc = recipe.image;
        let recName = recipe.label;
        let cookTime= recipe.totalTime;
        if (cookTime==0){
            cookTime = "Unknown";
        }else{
            cookTime += " min";
        }

        let innerHtml = "<div class='recipe'>";
        innerHtml += "<img src='" + imgSrc + "'>";
        innerHtml += "<div class='recipe-text'>";
        innerHtml += "<h3 class='recipe-name'>" + recName + "</h3>";
        innerHtml += "<div class='recipe-specs'>";
        innerHtml += "<p>Cook time: " + cookTime + "</p>";
        innerHtml += "<p>Calories per serving: " + calories.toFixed(0) + "</p>";
        innerHtml += "</div>"
        innerHtml += "<div class='recipe-link'><p><a href='"+recURL+"'>See Recipe</a></p></div>"
        innerHtml += "</div></div>"

        recipeList += innerHtml;
    }
    document.getElementById("search-results").innerHTML = recipeList;
}

function buildURL(){
    let url = "https://api.edamam.com/search?";
    let keywords = document.getElementById("recipe-input").value;
    let wantDessert = document.getElementById("dessert-checkbox").checked;
    url += "q=" + keywords.replaceAll(" ", "+");
    if (wantDessert){
        url += "+dessert";
    }

    url += "&app_id="+appID+"&app_key=" +appKey;

    let numRec = document.getElementById("num-results-box").value;
    if(numRec == ""){
        numRec = "4";
    }
    url += "&from=0&to=" + numRec;
    
    let radios = document.getElementsByName("diet");
    var diet;
    for(let i = 0; i < radios.length; i ++){
        if(radios[i].checked){
            diet = radios[i].value;
        }
    }
    url += "&diet=" + diet;

    let exclude = document.getElementById("exclusion-input").value;
    if(exclude != ""){
        url += "&excluded=" + exclude.replaceAll(" ", "&excluded=");
    }

    return url;
}

function fetchFromAPI(url){
    fetch(url)
    .then(function(response){
        return response.json();
    }).then(function(json){
        presentHits(json.hits);
    }).catch(response => {
        console.log("Error caught! ", response);
    })
}

document.getElementById("search-button").addEventListener("click", (event) => {
    event.preventDefault();
    let url = buildURL();
    fetchFromAPI(url);
});

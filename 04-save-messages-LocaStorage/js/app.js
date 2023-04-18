// Variables
const TweetsList = document.querySelector('#lista-tweets');
const Form = document.querySelector('#formulario');
const Content = document.querySelector('#contenido');
let tweets = [];

// Events
eventListeners();

function eventListeners() {
    // When an user add a tweet
    Form.addEventListener('submit', addTweet);

    // When the document is ready
    document.addEventListener('DOMContentLoaded', () => {
        tweets = JSON.parse(localStorage.getItem('tweets')) || [];
        addHtml();
    });
}


// Functions
function addTweet(e) {
    e.preventDefault();
    // Text area 
    const tweet = document.querySelector('#tweet').value;

    // Validation
    if (tweet === '') {
        return throwError('Tweet No Puede Estar Vacio');
    }

    // Build Id and {}
    const tweetObj = {
        id: Date.now(),
        tweet,
    }

    // Add tweets to []
    tweets = [...tweets, tweetObj];

    // Add HTML
    addHtml();

    // Reset form
    Form.reset();
}

function clearList() {
    while (TweetsList.firstChild) {
        TweetsList.removeChild(TweetsList.firstChild);
    }
}

function throwError(error) {
    const EmptyHtml = document.createElement('p');
    EmptyHtml.textContent = `${error}`;
    EmptyHtml.classList.add('error');
    Content.appendChild(EmptyHtml);

    // Removing alert after 3 sec
    setTimeout(() => {
        EmptyHtml.remove();
    }, 3000);
}

function addHtml() {
    clearList();
    if(tweets.length > 0) {
        tweets.forEach(tweet => {
            // Add delete button
            const btnDelete = document.createElement('a');
            btnDelete.classList.add('borrar-tweet');
            btnDelete.innerText = 'X';

            // Add delete function
            btnDelete.onclick = () => {
                deleteTweet(tweet.id);
            }

            // Create HTML
            const li = document.createElement('li');

            // Add text
            li.innerText = `${tweet.tweet}`;

            // Assign button
            li.appendChild(btnDelete);

            // Inset in the end
            TweetsList.appendChild(li); 
        });
    }
    synchronizeStorage();
}

// Delete a tweet
function deleteTweet(id) {
    tweets = tweets.filter(tweet => tweet.id !== id);

    addHtml();
}

// Add current tweets to LocalStorage
function synchronizeStorage() {
    localStorage.setItem('tweets', JSON.stringify(tweets));
}
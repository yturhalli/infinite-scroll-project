const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

let isInitialLoad = true

// Unsplash API
const initialPhotoAmount = 5;
const apiKey = 'B1Icba1oeyq9R649na4ekSZy1KjwWxfGx0uYK-TTueo';
const apiUrl= `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialPhotoAmount}`;

function updateApiUrlWithNewPhotoAmount(photoAmount){
    apiUrl= `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${photoAmount}`;
}

//Check if all images were loaded
function imageLoaded(){
    imagesLoaded++;
if(imagesLoaded === totalImages){
    ready = true;
    loader.hidden = true;
}
}
//Helper function to set attributes
function setAttributes(element, attributes){
    for(const key in attributes){
        element.setAttribute(key, attributes[key])
    }
}
//Create elements For Links & Photos, Add to DOM
function displayPhotos(){
    imagesLoaded = 0;
    totalImages = photosArray.length;
    photosArray.forEach(photo => {
        // Create <a> to link to unsplash
        const item = document.createElement('a');
        
        setAttributes(item, {
            href : photo.links.html,
            target: '_blank'
        });
        // Create img fot photo
        const img = document.createElement('img');
        setAttributes(img, {
            src : photo.urls.regular,
            alt : `A photo by ${photo.user.first_name} ${photo.user.last_name}`,
            title : `A photo by ${photo.user.first_name} ${photo.user.last_name ? photo.user.last_name : ''}`
        });
        //Eventlistener, check when each is finished loading
        img.addEventListener('load', imageLoaded)

        //Put <img> inside <a>
        item.appendChild(img);
        imageContainer.appendChild(item);
    })
}

//Get photos from unsplash api
async function getPhotosFromApi(){
    try{
        const res = await fetch(apiUrl);
        photosArray = await res.json();
        displayPhotos();
        if(isInitialLoad){
            updateApiUrlWithNewPhotoAmount(30);
            isInitialLoad = false;
        }
    } catch (err){
        console.log(err);
    }
}
//check to see if scrolling near bottom of page, load photos
window.addEventListener('scroll', ()=> {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready){
        ready = false;
        getPhotosFromApi();
    }
});

//Onload
getPhotosFromApi();
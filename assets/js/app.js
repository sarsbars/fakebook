'use strict';
const form = document.querySelector('form');
const getImage = document.querySelector('.get-image');
const contentTextarea = document.querySelector('textarea');
const postButton = document.querySelector('.show-image');


const profilePic = document.querySelector('.profile-pic');
const modal = document.querySelector('.modal.user-account-modal');
const closeButton = document.querySelector('.close-button');
const userIdValue = document.querySelector('.user-id');
const userNameValue = document.querySelector('.user-name-display');
const userUsernameValue = document.querySelector('.user-username');
const userEmailValue = document.querySelector('.user-email');
const displayImageArea = document.querySelector('.display-image');


class User {
    #id;
    #name;
    #userName;
    #email;

    constructor(name, username, email) {
        this.#id = Date.now();
        this.#name = name;
        this.#userName = username;
        this.#email = email;
    }

    get id() { return this.#id; }
    get name() { return this.#name; }
    get username() { return this.#userName; }
    get email() { return this.#email; }

    getInfo() {
        return {
            id: this.#id,
            name: this.#name,
            username: this.#userName,
            email: this.#email
        };
    }
}

class Subscriber extends User {
    #pages;
    #groups;
    #canMonetize;

    constructor(name, username, email, pages, groups, canMonetize) {
        super(name, username, email)
        this.#pages = pages;
        this.#groups = groups;
        this.#canMonetize = canMonetize;
    }

    get pages() { return this.#pages; }
    get groups() { return this.#groups; }
    get canMonetize() { return this.#canMonetize; }
 // Asked ChatGPT how to use the spread operator to combine class + super info
    getInfo() {
        return {...super.getInfo(), pages: this.#pages, groups: this.#groups };
        }
}

const currentSubscriber = new User("Isabelle", "mayormayor", "isabelle@acnh.com");

const currentUser = new Subscriber(
    "Tom Nook",
    "givemebells",
    "TNook@acnh.com",
    ["Animal Crossing Official", "Town Hall Updates"],
    ["Town Residents Group", "Gardening Enthusiasts"],
    true
);



function getDate() {
    const dateDisplay = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', dateDisplay);
}

let postImageSrc = null; 

function postImage() { 
    //googled how to use FileReader()
    if (getImage.files.length > 0) {
        const image = getImage.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(image);

        reader.onload = function() {
            postImageSrc = reader.result;
        }
    } else {
        postImageSrc = null;
     
    }
}

function newPost(textContent, imageSrc) {
    const date = getDate();
    const postSection = document.createElement('section');
    postSection.classList.add('post');
    postSection.innerHTML = `
        <div class="post-header">
            <div class="post-author-info">
                <div class="post-author-pic profile-pic"></div>
                <div class="post-author-name">Tom Nook</div>
            </div>
            <div class="post-date">${date}</div>
        </div>
        <div class="content">
            ${textContent}
        </div> 
        ${
            typeof imageSrc === 'string'
              ? `<div class="display-image"><img src="${imageSrc}"></div>`
              : ''
          }
    `; // the above comes from chatGPT
    const container = document.querySelector('.container');
    container.insertBefore(postSection, container.querySelector('.post'));
}

getImage.addEventListener('change', function () {
    postImage();

    //the following was from chatGPT, how to display file information
    const fileNameDisplay = document.querySelector('.file-name-display');
    if (getImage.files.length > 0) {
        fileNameDisplay.textContent = getImage.files[0].name;
    } else {
        fileNameDisplay.textContent = '';
    }
});

postButton.addEventListener('click', () => {
    const textContent = contentTextarea.value;
    const errorMessage = document.querySelector('.post-error-message');
//Asked chatGPT how to validate a form
    if (textContent.trim() !== "" || getImage.files.length > 0) {
        newPost(textContent, postImageSrc);
        form.reset();
        postImageSrc = null;
        errorMessage.textContent = '';
        document.querySelector('.file-name-display').textContent = ''; 
    } else {
        errorMessage.textContent = 'Post cannot be empty.';
    }
});

profilePic.addEventListener('click', () => {
    const userInfo = currentSubscriber.getInfo();

    userIdValue.textContent = userInfo.id;
    userNameValue.textContent = userInfo.name;
    userUsernameValue.textContent = userInfo.username;
    userEmailValue.textContent = userInfo.email;

    modal.style.display = "block";
});

closeButton.addEventListener('click', () => {
    modal.style.display = "none";
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});
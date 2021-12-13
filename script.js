const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteURLEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};

// Show modal, focus on input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal event listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// Validate form
function validate(nameValue, URLValue) {
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);

    if (!nameValue || !URLValue) {
        alert('Please submit values for both fields.');
        return false;
    }
    if (!URLValue.match(regex)) {
        alert("Please provide a valid web URL.");
        return false;
    }

    return true;
}

// Build bookmarks DOM
function buildBookmarks() {
    // We have to remove all bookmarks elements eveytime, otherwise things will be duplicated
    bookmarksContainer.textContent = '';

    // Build items
    Object.keys(bookmarks).forEach((id) => {
        const {name,URL} = bookmarks[id];

        // Create item
        const item = document.createElement('div');
        item.classList.add('item');

        // Close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${URL}')`);

        // Favicon/Link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');

        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${URL}`);
        favicon.setAttribute('alt', 'Favicon');

        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${URL}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        
        // Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

// Fetch bookmarks from local storage
function fetchBookmarks() {
    // Get bookmarks from localStorage if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create bookmarks array in localStorage
        // const id = 'http://instagram.com/iamytl_'
        // bookmarks[id] = {
        //     name: 'YT instagram',
        //     URL: 'https://instagram.com/iamytl_'
        // }
        // localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(id) {
    if (bookmarks[id]) {
        delete bookmarks[id]
    }
    // Update bookmarks array in localStorage, re-populate the DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Handle data from form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let URLValue = websiteURLEl.value;
    if (!URLValue.includes('http://', 'https://')) {
        URLValue = `https://${URLValue}`;
    }
    if (!validate(nameValue, URLValue)) {
        return false;
    }
    const bookmark = {
        name: nameValue,
        URL: URLValue,
    };
    bookmarks[URLValue] = bookmark;
    // Set bookmarks in localStorage, fetch, reset input fields
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Event listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On load, fetch bookmarks
fetchBookmarks();
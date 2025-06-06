const modal = document.getElementById("modal");
const songsArray = playlistData.map((currentValue) => {return currentValue.songs})
const playlistGrid = document.getElementById("playlist-cards")
var renderedPlaylists = playlistData;
const newSongs = []

//**--------------------------DYNAMICALLY LOAD PLAYLIST DATA--------------------------**//

//Pull data from .js file and dynamically load playlists as well as additional features
function loadPlaylistData(renderedPlaylists){

    playlistGrid.innerHTML = ``

    if(renderedPlaylists.length === 0){
        const element = noPlaylistsMessage();
        playlistGrid.appendChild(element);
    }

    const addPlaylistElement = document.createElement('div');
    addPlaylistElement.className = 'add-playlist'
    addPlaylistElement.textContent = '+'
    playlistGrid.appendChild(addPlaylistElement);

    renderedPlaylists.forEach(playlist => {
        const element = createPlaylistElement(playlist);
        playlistGrid.appendChild(element);
    })
}

//Create a playlist element to add
function createPlaylistElement(playlist){
    const div = document.createElement('article');
    div.className = 'playlist';
    div.innerHTML = `
        <img class="playlist-cover" src=${playlist.playlist_art} alt="">
        <h3 class="playlist-title">${playlist.playlist_name}</h3>
        <h4 class="playlist-creator-name">${playlist.playlist_author}</h4>
        <div class="like-count">
        <p class="like-icon">&#128420;</p>
        <p class="like-number">${playlist.like_count}</p>
        </div>
        <div class='playlist-actions'>
        <span class='delete-playlist'>&#9940;</span>
        <span class='edit-playlist'>...</span>
        </div>
    `;
    return div;
}

//Create a no playlist message
function noPlaylistsMessage() {
    const div = document.createElement('div');
    div.className = 'no-playlists';
    div.innerHTML = `No playlists added...`
    return div
}

//Load the playlist data
loadPlaylistData(renderedPlaylists);
const playlists = Array.from(document.querySelectorAll(".playlist"));

//-------------------------------------------------------------------------------------------------//

//**---------------------MODAL FUNCTIONALLITY AND DYNAMICALLY POPULATE MODAL---------------------**//

//Open Playlist details modal
function openModal(playlist) {
    populateModal(playlist);
    modal.style.display = "block";

    const shuffleBtn = document.querySelector('.shuffle-button')
    
    shuffleBtn.addEventListener('click', () => {
        const modal_content = document.getElementById('modal-content');
        let songList = document.querySelector('.song-list');
        modal_content.removeChild(songList)
        
        const shuffledSongs = shuffleArray(playlist.songs)
        songList = createModalSongList(shuffledSongs)
        modal_content.appendChild(songList)
    })
}

//Create event listners for each playlist and display modal on click
function createPlaylistEventListeners() {
    const playlists = Array.from(document.querySelectorAll(".playlist"));
    for(i = 0; i < playlists.length; i++){
        playlists[i].addEventListener("click", (event) => {

            let clickedIndex = -1;

            if(event.target.className == 'playlist'){
                clickedIndex = playlists.indexOf(event.target)
            }else if(event.target.className == 'like-icon' || event.target.className == 'like-number'
                 || event.target.className == 'delete-playlist' || event.target.className == 'edit-playlist'
                || event.target.className == 'edit-title' || event.target.className == 'edit-author' ){
                return;
            }else {
                clickedIndex = playlists.indexOf(event.target.parentNode)
            }

            openModal(playlistData[clickedIndex])

        })
    }
}

createPlaylistEventListeners();

window.onclick = function(event) {
   if (event.target == modal) {
      modal.style.display = "none";
   }
}

//Add playlist specifc data to our modal
function populateModal(playlist){
    const modal_content = document.getElementById('modal-content');
    modal_content.innerHTML = ``

    const span = document.createElement('span');
    span.className = 'close';
    span.innerHTML = '&times;';
    span.addEventListener("click", () => {
        modal.style.display = "none"
    })
    modal_content.appendChild(span);

    const header = createModalHeaderElement(playlist);
    modal_content.appendChild(header);

    const song_list = createModalSongList(playlist.songs);
    modal_content.appendChild(song_list);

}

//------------------------------------------------------------------------------------------------//

//**--------------------------CREATE EACH OF THE MODAL ELEMENTS TO ADD--------------------------**//

//Create the Header element for the playlist details modal
function createModalHeaderElement(playlist){
    const div = document.createElement('div');
    div.className = 'modal-header';

    div.innerHTML = `<img id="modal-playlist-cover" src="${playlist.playlist_art}" alt="">
                    <div class="playlist-info">
                    <h2 id="modal-title">${playlist.playlist_name}</h2>
                    <h3 id="modal-creator">${playlist.playlist_author}</h3>
                    <button type="button" class="shuffle-button">Shuffle</button>
                    </div>
    `
    return div;
}

//Create the song list element for the playlist details modal
function createModalSongList(songs){
    const div = document.createElement('div');
    div.className = 'song-list';
    for (i = 0; i < songs.length; i++) {
        const songElement = createModalSongTile(songs[i]);
        div.appendChild(songElement);
    }

    return div;
}

//Create a song tile to insert into our playlist details song list
function createModalSongTile(song){
    const div = document.createElement('article');
    div.className = 'song-tile';
    div.innerHTML = `
        <img class="song-cover" src="${song.song_art}" alt="">
        <div class="song-info">
            <h5 class="song-title">${song.song_title}</h5>
            <h6 class="artist-name">${song.song_author}</h6>
            <h6 class="albumn-name">${song.albumn_name}</h6>
        </div>
        <h5 class="song-duration">${Math.floor(song.song_duration / 60)}:${String(song.song_duration % 60).padStart(2,'0')}</h5>`
    return div;
}

//------------------------------------------------------------------------------------------------//

//**---------------------------------LIKE BUTTON FUNCTIONALITY---------------------------------**//

//Pull like icons and add event handlers for icons and counts
function addLikeFunction(){

    //add event listners
    const playlists = Array.from(document.querySelectorAll(".playlist"));
    const likeIcons = playlists.map((currentValue) => { return currentValue.querySelector('.like-icon') })
    const likeCounts = playlists.map((currentValue) => { return currentValue.querySelector('.like-number') })

    likeIcons.forEach ( likeIcon => {
        likeIcon.addEventListener("click", (event) => {

            const clickedIndex = likeIcons.indexOf(likeIcon);

            //Get new like count
            if(playlistData[clickedIndex].liked){
                playlistData[clickedIndex].like_count--;
                playlistData[clickedIndex].liked = false;
                likeIcon.innerHTML = `&#128420;`
            }else {
                playlistData[clickedIndex].like_count++;
                playlistData[clickedIndex].liked = true;
                likeIcon.innerHTML = `&#129505;`
            }

            //Update the like count
            updateLikeCount(likeCounts[clickedIndex], playlistData[clickedIndex].like_count);

        })
    })

}

//Take a like count element and update the value
function updateLikeCount(likeCount, count) {
    likeCount.textContent = `${count}`
}

addLikeFunction();

//------------------------------------------------------------------------------------------------//

//**------------------------------------SHUFFLE SONGS FEATURE------------------------------------**/

//Randomly shuffle array function for the shuffle feature
function shuffleArray(arr){
    for(i = arr.length - 1; i > 0; i--){
        let randIndex = Math.floor(Math.random() * (i - 1));
        let temp = arr[i];
        arr[i] = arr[randIndex];
        arr[randIndex] = temp;
    }
    return arr
}

//------------------------------------------------------------------------------------------------//

//**------------------------------------DELETE FUNCTIONALITY------------------------------------**//

//Create event listener for each of the delete icons and remove playlist on event
function addDeleteFunction() {

    const playlists = Array.from(document.querySelectorAll(".playlist"));
    const deleteIcons = playlists.map((currentValue) => {return currentValue.querySelector('.delete-playlist')})

    deleteIcons.forEach ( icon => {
        icon.addEventListener('click', () => {
            const clickedIndex = deleteIcons.indexOf(icon);
            playlists[clickedIndex].remove();
            renderedPlaylists.splice(clickedIndex,1);
            playlistData.splice(clickedIndex,1);
            refreshPlaylists();
        })
    })

}
addDeleteFunction();

//------------------------------------------------------------------------------------------------//

//Refresh the playlist grid for additions and deletions, re-adds all event handlers and tiles
function refreshPlaylists(){
    loadPlaylistData(renderedPlaylists);
    createPlaylistEventListeners();
    addDeleteFunction();
    addLikeFunction();
    addEditEventListners();
    createAddPlaylistEvent();
}

//**-------------------------------------ADD FUNCTIONALITY--------------------------------------**//

//add event listner to the add playlist button
function createAddPlaylistEvent(){
    const addButton = document.querySelector('.add-playlist');
    addButton.addEventListener('click', () => {
        newSongs.length = 0;
        openAddModal();

    })
}
createAddPlaylistEvent();

//populate modal with add playlist form
function openAddModal() {
    populateAddModal();
    modal.style.display = "block";
}

//Populate the modal with the details for the add playlist form
function populateAddModal(){
    const modal_content = document.getElementById('modal-content');
    modal_content.innerHTML = ``

    const span = document.createElement('span');
    span.className = 'close';
    span.innerHTML = '&times;';
    span.addEventListener("click", () => {
        modal.style.display = "none"
    })
    modal_content.appendChild(span);

    const playlistInput = createNewPlaylistInfoElement();
    modal_content.appendChild(playlistInput);
    
    const playlistSubmit = document.querySelector('.add-playlist-form');
    playlistSubmit.addEventListener("submit", (event) => {
        addPlaylistToList(event);
    })

    const songInput = createAddSongListElement();
    modal_content.appendChild(songInput);

    const songSubmit = document.querySelector('.add-song-form');
    songSubmit.addEventListener("submit", (event) => {
        addSongToList(event);
    })

}

//Create form element for the new playlists details
function createNewPlaylistInfoElement() {
    const div = document.createElement('form');
    div.className = 'add-playlist-form'
    div.innerHTML = `
        <h2 class='add-modal-header'>Add Playlist</h2>
        <label for='image-file'>Add Playlist Cover:</label><br>
        <input type='file' id='image-file' name='input-image' accept="image/*"><br>
        <label for='name-in'>Playlist Name:</label><br>
        <input type='text' id='name-in' name='name-in'><br>
        <label for='author-in'>Author Name:</label><br>
        <input type='text' id='author-in' name='author-in'><br>
        <input type='submit' value='Create New Playlist' class='create-playlist'>
    `
    return div;
}

//Create form element for the new playlists song list
function createAddSongListElement() {
    const div = document.createElement('section');
    div.className = 'addSongList';
    div.innerHTML = `
        <form class='add-song-form'>
        <label for='add-song-name'>Song Name: </label>
        <input type='text' id='add-song-name' name='add-song-name'>
        <label for='add-song-artist'>Artist: </label>
        <input type='text' id='add-song-artist' name='add-song-artist'>
        <input type='submit' value="Add Song" class='add-song'>
        </form>
    `
    const newSongList = createModalSongList(newSongs);
    div.appendChild(newSongList);
    return div;
}

//On submission of song create a new song object and add it to the songs array to be pushed to the new playlist element
function addSongToList(event) {
    event.preventDefault();

    const title = document.getElementById('add-song-name').value;
    const artist = document.getElementById('add-song-artist').value;
    const albumn = ''
    const duration = 0
    const img = "assets/img/song.png"

    const newSong = {
        song_title: title,
        song_author: artist,
        albumn_name: albumn,
        song_duration: duration,
        song_art: img
    }

    newSongs.push(newSong);
    const songList = document.querySelector('.song-list');
    songList.appendChild(createModalSongTile(newSong));
    event.target.reset();
}

//On submission creates new playlist object and adds playlist to the grid
function addPlaylistToList(event) {
    event.preventDefault();

    const name = document.getElementById('name-in').value;
    const author = document.getElementById('author-in').value;

    const fileList = document.getElementById('image-file')

    if(fileList.files.length === 0){
        var cover = 'assets/img/playlist.png'
    }else{
        var cover = 'assets/img/' + document.getElementById('image-file').files[0].name;
    }

    const newPlaylist = {
        playlistID: ++playlists.length,
        playlist_name: name,
        playlist_author: author,
        playlist_art: cover,
        like_count: 0,
        liked: false,
        songs: newSongs
    }
    
    playlistData.push(newPlaylist);
    refreshPlaylists();
    modal.style.display = "none";
    event.target.reset();
}

//------------------------------------------------------------------------------------------------//

//**------------------------------------SORT FUNCTIONALITY--------------------------------------**//

//Pull sort button elements
const titleSortElement = document.querySelector('.alpha-sort')
const likeSortElement = document.querySelector('.like-sort')
const dateSortElement = document.querySelector('.date-sort')

//-----------------Event listeners for each sort button------------//

titleSortElement.addEventListener('click', () => {

    playlistData.sort((a,b) => a.playlist_name.localeCompare(b.playlist_name));
    refreshPlaylists();
})

likeSortElement.addEventListener('click', () => {

    playlistData.sort((a,b) => b.like_count - a.like_count)
    refreshPlaylists();

})

dateSortElement.addEventListener('click', () => {

    playlistData.sort((a,b) => b.playlistID - a.playlistID)
    refreshPlaylists();

})
//-------------------------------------------------------------------//

//------------------------------------------------------------------------------------------------//

//**------------------------------------EDIT FUNCTIONALITY--------------------------------------**//

//Add event listners for all edit buttons
function addEditEventListners() {
    const playlists = Array.from(document.querySelectorAll(".playlist"));
    const editIcons = playlists.map((currentValue) => {return currentValue.querySelector('.edit-playlist')})

    editIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const clickedIndex = editIcons.indexOf(icon)
            openEdit(playlists[clickedIndex]);
        })
    })
}
addEditEventListners();

//Add an edit modal to change the current playlist name, author, or songs
function openEdit(playlist) {

    const oldTitle = playlist.querySelector('.playlist-title');
    const newInput = document.createElement('input');
    newInput.type = 'text'
    newInput.className = 'edit-title'
    newInput.value = oldTitle.textContent
    oldTitle.replaceWith(newInput);

    const oldAuthor = playlist.querySelector('.playlist-creator-name');
    const newInputAuth = document.createElement('input');
    newInputAuth.type = 'text'
    newInputAuth.className = 'edit-author'
    newInputAuth.value = oldAuthor.textContent
    oldAuthor.replaceWith(newInputAuth);

    editTitleEvent(playlist);
    editAuthorEvent(playlist);
}

//Move cursor to next input box after user 'enters'
function editTitleEvent(playlist) {
    const input = playlist.querySelector('.edit-title');
    input.addEventListener('keyup', (event) => {
        if(event.key === "Enter"){
            const inputAuth = playlist.querySelector('.edit-author')
            inputAuth.focus()
        }
    })
}

//Upon pressing enter on the author input set new playlist title and author
function editAuthorEvent(playlist) {
    const input = playlist.querySelector('.edit-author');
    input.addEventListener('keyup', (event) =>{
        if(event.key === "Enter"){
            //Store new data
            const newTitle = playlist.querySelector('.edit-title').value
            const newAuthor = playlist.querySelector('.edit-author').value

            //update in playlist data
            const playlists = Array.from(document.querySelectorAll(".playlist"));
            const idx = playlists.findIndex(p => p === playlist)

            playlistData[idx].playlist_name = newTitle;
            playlistData[idx].playlist_author = newAuthor;

            //refresh page
            refreshPlaylists();

        }
    })
}

//------------------------------------------------------------------------------------------------//

//**------------------------------------SEARCH FUNCTIONALITY-------------------------------------**//

//Grab Search Elements
const searchBar = document.getElementById('search-input');
const clearSearch = document.querySelector('.search-clear');
const submitSearch = document.querySelector('.search-submit');

//-----------Create event listeners for each element------------//
submitSearch.addEventListener('click', () => {
    renderedPlaylists = filterPlaylistsFromSubstring(searchBar.value)
    refreshPlaylists();

})

clearSearch.addEventListener('click', () => {
    searchBar.value = ''
    renderedPlaylists = playlistData;
    refreshPlaylists();
})

searchBar.addEventListener("keypress", (event) => {
    if(event.key === "Enter"){
        renderedPlaylists = filterPlaylistsFromSubstring(searchBar.value)
        refreshPlaylists();
    }
})

//--------------------------------------------------------------//

//Filter the playlists based on a substring and return the resulting array
function filterPlaylistsFromSubstring(substring) {
    const playlists = playlistData.filter(item => item.playlist_name.includes(substring) || item.playlist_author.includes(substring));
    return playlists
}

//------------------------------------------------------------------------------------------------//
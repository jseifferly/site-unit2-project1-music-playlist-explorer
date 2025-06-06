const modal = document.getElementById("modal");
const songsArray = playlistData.map((currentValue) => {return currentValue.songs})
const playlistGrid = document.getElementById("playlist-cards")
const newSongs = []


//**--------------------------DYNAMICALLY LOAD PLAYLIST DATA--------------------------**//

function loadPlaylistData(){

    if(playlistData.length === 0){
        const element = noPlaylistsMessage();
        playlistGrid.appendChild(element);
    }

    const addPlaylistElement = document.createElement('div');
    addPlaylistElement.className = 'add-playlist'
    addPlaylistElement.textContent = '+'
    playlistGrid.appendChild(addPlaylistElement);

    playlistData.forEach(playlist => {
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
        <span class='edit-playlist'>&#128221;</span>
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
loadPlaylistData();
const playlists = Array.from(document.querySelectorAll(".playlist"));

//-------------------------------------------------------------------------------------------------//



//**---------------------MODAL FUNCTIONALLITY AND DYNAMICALLY POPULATE MODAL---------------------**//

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
            }else if(event.target.className == 'like-icon' || event.target.className == 'like-number' || event.target.className == 'delete-playlist'){
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

function createModalSongList(songs){
    const div = document.createElement('div');
    div.className = 'song-list';
    for (i = 0; i < songs.length; i++) {
        const songElement = createModalSongTile(songs[i]);
        div.appendChild(songElement);
    }

    return div;
}

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

function addLikeFunction(){

    //add event listners
    const playlists = Array.from(document.querySelectorAll(".playlist"));
    const likeIcons = playlists.map((currentValue) => { return currentValue.querySelector('.like-icon') })
    const likeCounts = playlists.map((currentValue) => { return currentValue.querySelector('.like-number') })

    console.log(likeIcons);

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

//add event listenrs
function addDeleteFunction() {

    const playlists = Array.from(document.querySelectorAll(".playlist"));
    const deleteIcons = playlists.map((currentValue) => {return currentValue.querySelector('.delete-playlist')})

    console.log(deleteIcons)
    deleteIcons.forEach ( icon => {
        icon.addEventListener('click', () => {
            const clickedIndex = deleteIcons.indexOf(icon);
            playlists[clickedIndex].remove();

        })
    })

}

addDeleteFunction();

//------------------------------------------------------------------------------------------------//

function refreshPlaylists(){
    
    createPlaylistEventListeners();
    addDeleteFunction();
    addLikeFunction();

}

//**-------------------------------------ADD FUNCTIONALITY--------------------------------------**//

//add event listner to the add playlist button
const addButton = document.querySelector('.add-playlist');
addButton.addEventListener('click', () => {
    newSongs.length = 0;
    openAddModal();
    
})


//populate modal with add playlist form
function openAddModal() {
    populateAddModal();
    modal.style.display = "block";
}

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

function addPlaylistToList(event) {
    event.preventDefault();

    const name = document.getElementById('name-in').value;
    const author = document.getElementById('author-in').value;
    const cover = document.getElementById('image-file').files[0].name;

    const newPlaylist = {
        playlistID: ++playlists.length,
        playlist_name: name,
        playlist_author: author,
        playlist_art: 'assets/img/' + cover,
        like_count: 0,
        liked: false,
        songs: newSongs
    }
    
    addNewPlaylist(newPlaylist);
    modal.style.display = "none";
    event.target.reset();
}

function addNewPlaylist(playlist) {
    
    //Add to js data
    playlistData.push(playlist)
    console.log(playlistData)

    //Append to grid
    const playlistGrid = document.getElementById('playlist-cards');
    const playlistElement = createPlaylistElement(playlist)
    playlistGrid.appendChild(playlistElement)
    refreshPlaylists();

}

//------------------------------------------------------------------------------------------------//

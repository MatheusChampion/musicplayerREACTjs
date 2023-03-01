
const audioPlayer = document.querySelector('.buttons-container')
const audio = document.querySelector('.audio_src')
const audio_name = document.querySelector('.music_place_name')
const album_name = document.querySelector('.album_name')
const artist_name = document.querySelector('.a_name')
const playButton = audioPlayer.querySelector('.play-button')
const album_cover = document.querySelector('.cover-img')

const volume = document.querySelector('.volume')
const currentTimeElement = document.querySelector('.current')
const durationTimeElement = document.querySelector('.duration')

const progress = document.querySelector('.audio-progress')
const progressBar = document.querySelector('.audio-progress-filled')

const music_list = document.querySelector('.music_list');



window.myAPI.onSendMusic((_event, value) => {
    console.log(value)
    $(document).ready(() => {

        $(".table").on("click", "td", function () {
            var index = $(this).parent().index('tr');
            currentIndex = index

            DisplayCurrentMusic()

            audio.play();
        });


        let row_count = 1

        value.forEach(function (music) {       
            // Time calculation
            function secondsToMinutes(time){
                let num = 1;
                if (time >= 600){
                    num = 2;
                }         
                const m = Math.floor(time / 60).toString().padStart(num,'0');
                const s = Math.floor(time % 60).toString().padStart(2,'0');

                return m + ":" + s;
            }


            let row = '<tr>'
            row += '<td>' + row_count + '</td>'
            row += `<td> <img src="` +  imgCorrect(music) + `" alt="Cover Album" class="col cover-img img_fluid p-0"/> </td>`
            row += '<td>' + music.title + '</td>'
            row += '<td>' + music.album + '</td>'
            row += '<td>' + music.artist + '</td>'
            row += '<td>' + music.year + '</td>'
            row += '<td>' + secondsToMinutes(music.duration) + '</td>'
            row += '</tr>'
            $('.table tbody').append(row)
    
            row_count++
        })

        currentIndex = 1;
    
        DisplayCurrentMusic()
    });

    
    function imgCorrect(path){
        const rightPath = path.picture.replace(/"/g, '');
        let image = 'data:';
        image += path.pictureFormat;
        image += ';base64,';
        image += rightPath;

        return image;
    }


    function DisplayCurrentMusic() {
        let index = currentIndex - 1 
        
        
        audio_name.innerHTML = value[index].title;
        album_name.innerHTML = value[index].album;
        artist_name.innerHTML = value[index].artist;
        audio.setAttribute('src', value[index].path);
        album_cover.setAttribute('src', imgCorrect(value[index]));


        $("tr").removeClass() 
    
        $("tr:eq('" + currentIndex + "')").addClass('selected-row')
    }
    
        
})


//Play & Pause button
audio.onplay = function() {
    playButton.innerHTML = '<img src="./images/Pause.png" alt="Pause button"  class="icon-img img_fluid"">'
}

playButton.addEventListener('click', (e) => {
    if(audio.paused) {
        audio.play()
        e.target = playButton.innerHTML = '<img src="./images/Pause.png" alt="Pause button" class="icon-img img_fluid">'
    } else {
        audio.pause()
        e.target = playButton.innerHTML = '<img src="./images/Play.png" alt="Play button" class="icon-img img_fluid">'
    }
})

//Volume 
volume.addEventListener('mousemove', (e) => {
    audio.volume = e.target.value
})

//duration

const currentTime = () => {
    let currentMinutes = Math.floor(audio.currentTime / 60)
    let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60)
    let durationMinutes = Math.floor(audio.duration / 60)
    let durationSeconds = Math.floor(audio.duration - durationMinutes * 60)
    
    currentTimeElement.innerHTML = `&nbsp;&nbsp;${currentMinutes}:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}&nbsp;&nbsp;`
    durationTimeElement.innerHTML = `&nbsp;&nbsp;${durationMinutes}:${durationSeconds < 10 ? '0' + durationSeconds : durationSeconds}&nbsp;&nbsp;`
}

audio.addEventListener('timeupdate' , currentTime)


//Progress bar 
audio.addEventListener('timeupdate', () =>{
    const porcent = (audio.currentTime / audio.duration) * 100
    progressBar.style.width = `${porcent}%`
})

progress.addEventListener('click', (e) =>{
    const progressTime = (e.offsetX / progress.offsetWidth) * audio.duration
    audio.currentTime = progressTime
})
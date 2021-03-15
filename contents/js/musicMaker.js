var musicMaker = {
    //Music Header Container Section
    makeInfoStuff: function(musicInfoContainer, newData) {
        musicInfoContainer.innerHTML = "";
        if(newData.nowPlaying.title) {
            let musicTitle = domMaker.init({
                type: "div",
                id: "musicTitle",
                innerHTML: newData.nowPlaying.title
            });
            musicInfoContainer.appendChild(musicTitle);
        }
        if(newData.nowPlaying.artist) {
            let musicArtist = domMaker.init({
                type: "div",
                id: "musicArtist",
                innerHTML: newData.nowPlaying.artist
            });
            musicInfoContainer.appendChild(musicArtist);
        }
    },
    makeArtworkStuff: function(musicArtworkContainer, newData) {
        musicArtworkContainer.innerHTML = "";
        const musicDecoration = domMaker.init({
                type: "div",
                id: "musicDecoration"
            }),
            musicArtwork = domMaker.init({
                type: "img",
                src: newData.nowPlaying.artwork ? newData.nowPlaying.artwork : "contents/icons/defaultArtwork.jpg"
            });
        domMaker.domAppender({
            div: musicArtworkContainer,
            children: [musicDecoration, musicArtwork]
        });
    },
    openMusicPlayingApp: function(newData, musicArtworkContainer) {
        let appID = newData.nowPlayingApplication.identifier;
        drawer.openApp(appID);
    },
    populateMusicHeader: function(musicArtworkContainer, musicInfoContainer, newData) {
        this.makeArtworkStuff(musicArtworkContainer, newData);
        this.makeInfoStuff(musicInfoContainer, newData);
        musicArtworkContainer.addEventListener("click", function() {
            musicMaker.openMusicPlayingApp(newData, musicArtworkContainer);
        });
    },
    makeMusicHeaderContainer: function() {
        const mainDiv = domMaker.init({
                type: "div",
                id: "musicHeaderContainer"
            }),
            musicArtworkContainer = domMaker.init({
                type: "div",
                id: "musicArtworkContainer"
            }),
            musicInfoContainer = domMaker.init({
                type: "div",
                id: "musicInfoContainer"
            });
        this.populateMusicHeader(musicArtworkContainer, musicInfoContainer, api.media);
        
        domMaker.domAppender({
            div: mainDiv,
            children: [musicArtworkContainer, musicInfoContainer]
        });
        return mainDiv
    },
    //Music Buttons Container Section
    populateMusicButtonsContainer: function(musicButtonsContainer, newData) {
        musicButtonsContainer.innerHTML = "";
        let playButtonIcon = newData.isPlaying ? "contents/icons/widgetIcons/pause.png" : "contents/icons/widgetIcons/play.png";
        const reverseButton = domMaker.init({
                type: "div",
                id: "reverseButton",
                className: 'musicButtons',
                innerHTML: `
                <img id='reverseButtonIcon' src='contents/icons/widgetIcons/back.png' />
                `
            }),
            playButton = domMaker.init({
                type: "div",
                id: "playButton",
                className: 'musicButtons',
                innerHTML: `
                <img id='playButtonIcon' src='${playButtonIcon}' />
                `
            }),
            nextButton = domMaker.init({
                type: "div",
                id: "nextButton",
                className: 'musicButtons',
                innerHTML: `
                <img id='nextButtonIcon' src='contents/icons/widgetIcons/skip.png' />
                `
            });
        domMaker.domAppender({
            div: musicButtonsContainer,
            children: [reverseButton, playButton, nextButton]
        })
    },
    makeMusicButtonsContainer: function() {
        const mainDiv = domMaker.init({
                type: "div",
                className: "musicButtonsContainer",
            });
        this.populateMusicButtonsContainer(mainDiv, api.media);
        mainDiv.addEventListener("touchend", function(e) {
            if(e.target.id && !drawer.movedWhilePressing) {
                switch(e.target.id) {
                    case 'reverseButton':
                        api.media.previousTrack();
                        break;
                    case 'playButton':
                        api.media.togglePlayPause();
                        break;
                    case 'nextButton': 
                        api.media.nextTrack();
                        break;
                }
                setTimeout(function(){
                    drawer.animateIcon(false, e.target.id);
                }, 100);
                setTimeout(function() {
                    musicMaker.populateMusicButtonsContainer(mainDiv, api.media);
                }, 500);
                drawer.movedWhilePressing = false;
            }
        });
        mainDiv.addEventListener('touchstart', drawer.animateApp, false);
        mainDiv.addEventListener('touchmove', () => drawer.movedWhilePressing = true);
        return mainDiv;
    },
    init: function() {
        let musicHeaderContainer = this.makeMusicHeaderContainer();
        let musicButtonsContainer = this.makeMusicButtonsContainer();
        domMaker.domAppender({
            div: loadWidget.contentContainer,
            children: [musicHeaderContainer, musicButtonsContainer]
        });
    }
}

/* XenHTML API Observers */
api.media.observeData(function(newData) {
    if(musicActive) {
        musicMaker.populateMusicHeader(document.getElementById("musicArtworkContainer"), document.getElementById("musicInfoContainer"), newData);
        if(!newData.isPlaying) {
            document.getElementById("musicArtworkContainer").removeEventListener('click', function() {musicMaker.openMusicPlayingApp});
        }
    }
});
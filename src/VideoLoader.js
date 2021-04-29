import videojs from 'video.js';
import '../node_modules/video.js/dist/video-js.min.css';
import 'videojs-vr/dist/videojs-vr.min.js';
import '@videojs/http-streaming/dist/videojs-http-streaming';

const container = document.createElement('div');
container.classList.add("Video");
container.style.width = '100%';
container.style.height = '300px';

const videoContainer = document.createElement('video');
videoContainer.style.width = '100%';
videoContainer.style.height = '100%';
videoContainer.classList.add('video-js');
videoContainer.crossOrigin = 'anonymous';
videoContainer.setAttribute('data-setup', '{"controls": true, "autoplay": false, "preload": "auto"}');

container.appendChild(videoContainer);
document.getElementById('a-root').appendChild(container);


let player;

const Video = {
    load: () => {

        var url = "https://test.issimissimo.com/folderToLoadFiles/chivasso stanze sonia vairo.mp4"

        player = videojs(videoContainer, {
            html5: {
                vhs: {
                    withCredentials: true
                }
            }
        });

        player.vr({ projection: '360_TB' });
        player.src({
            src: url,
        });
    }
}

export default Video;


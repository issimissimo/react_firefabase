import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
import imgTest from '../UX.jpg';
import background from '../trasparent.png'


const container = document.createElement('div');
container.classList.add("Image");
container.style.width = '100%';
container.style.height = '300px';

const imageContainer = document.createElement('img');
imageContainer.style.display = 'inline';
imageContainer.style.width = '100%';
imageContainer.style.height = '100%';
imageContainer.src = background;

container.appendChild(imageContainer);
document.getElementById('a-root').appendChild(container);


let viewer;

const Image = {
    load: () => {
        viewer = new Viewer(imageContainer, {
            inline: true,
            backdrop: false,
            navbar: false,
            toolbar: false,
            title: false,
            zoomRatio: 0.2,
            transition: false,
            button: false,
            view(event) {
                console.log("view")
            },
            viewed(event) {
                console.log("viewed")
            },
            // viewed() {
            //     viewer.zoomTo(1);
            // },
            url() {
                return imgTest;
            },
        });
    }
};


export default Image;
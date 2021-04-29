import { Viewer } from 'photo-sphere-viewer';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css';
import imgTest from '../panorama.jpg';


const container = document.createElement('div');
container.style.width = '100%';
container.style.height = '300px';
container.classList.add("Panorama");
document.getElementById('a-root').appendChild(container);


let viewer;

const Panorama = {
    load: () => {
        viewer = new Viewer({
            container: container,
            panorama: imgTest
        });
    }
}

export default Panorama;
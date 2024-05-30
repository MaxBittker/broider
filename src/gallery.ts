import { galleryLineString } from './render';


let title = document.getElementById('title');
let submit = document.getElementById('submit');
let gallery = document.getElementById('gallery');
let renderCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('render');

interface submission {
    dataUrl: string,
    title: string,
    pixelRatio: number,
}
let submissions = JSON.parse(window.localStorage.getItem('submissions') || '[]') as submission[];

submit!.addEventListener('click', () => {
    let dataURI = renderCanvas.toDataURL();
    let pixelRatio = parseInt(renderCanvas.dataset.pixelRatio);
    console.log(renderCanvas)
    console.log(renderCanvas.dataset)
    submissions.push({
        title: title.value,
        dataUrl: dataURI,
        pixelRatio: pixelRatio

    });
    window.localStorage.setItem('submissions', JSON.stringify(submissions));
    setupGallery();
});

function setupGallery() {
    let submissionHTMLs = submissions.map(submission => {
        return galleryLineString(submission.dataUrl, submission.title, submission.pixelRatio);
    });
    gallery!.innerHTML = submissionHTMLs.join('');
}

export { setupGallery }
export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
}

export function loadLevel(name) {
    return fetch(`'https://jilijo01.github.io/{name}.json`)
    .then(r => r.json());
}

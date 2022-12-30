class Slider {
    constructor (btns, imgs, init, ms, auto) {
        this.btns = [...btns]
        this.init = init
        this.ms = ms
        this.auto = auto
        this.imgs = [...imgs]
    };
    run () {
        this.btns[0].addEventListener('click', e => this.next(this.imgs, this.init));
        this.btns[1].addEventListener('click', e => this.prev(this.imgs, this.init));
        document.querySelectorAll('.thumb')
            .forEach( thumb => {
                thumb.addEventListener('click', e => {
                    console.log(e,e.target);
                    this.thumClickController(this.imgs, e.target);
            });
        });
    
        if ( this.auto ) (this.counter)(this.imgs, this.init, this.ms);
    }
    next (imgs, initial) {
        initial = this.update(imgs);
        initial = this.nextprev(initial, "up");
        initial = this.check(imgs, initial);
        this.classCleaner(imgs, 'active-img');

        imgs[initial].classList.add('active-img');
        this.thumbUpdater(imgs, initial);
    };
    prev (imgs, initial) {
        initial = this.update(imgs);
        initial = this.nextprev(initial, "down");
        initial = this.check(imgs, initial)
        this.classCleaner(imgs, 'active-img');
        imgs[initial].classList.add('active-img');
        this.thumbUpdater(imgs, initial);
    };
    counter (imgs, initial, ms) {                     // Called by itself in slider() and runs in each *ms
        let _ = setInterval( () => {
            initial = this.update(imgs);
            initial = this.nextprev(initial, "up");
            initial = this.check(imgs, initial);
            this.classCleaner(imgs, 'active-img');
            imgs[initial].classList.add('active-img');
            this.thumbUpdater(imgs, initial);

        }, ms );
    };
    check (imgs, initial) {                         // Called by counter(), prev(), next()
        if (initial < 0) {
            initial = imgs.length - 1
            return initial
        }; 
        if (initial >= imgs.length) {
            initial = 0
            return initial
        };
        return initial;
    };
    nextprev (initial, updown) {                    // Called by counter()
        switch (updown) {
            case "up" :
                return initial += 1
    
            case "down" :
                return initial -= 1
    
            default :
                return initial;
        };
    };
    update(imgs) {
        let index;
        [...imgs].forEach( (arg, i) => {
            [...arg.classList].forEach( cls => {
                if (cls === 'active-img') index = i;
            });
        });
        return index;
    };
    classCleaner (elements, cls) {
        elements.forEach( arg => {
            arg.classList.remove(`${cls}`);
        });
    }
    thumbUpdater(imgs, initial) {
        const dataSet = imgs[initial].querySelector('img').dataset.img
        const selectThumb = document.querySelector(`.thumb [data-thumb=${dataSet}]`).parentElement;

        document.querySelectorAll('.thumb').forEach( thumb => thumb.classList.remove('active-thumb') );
        selectThumb.classList.add('active-thumb'); 
    };
    thumClickController(imgs, target) {
        const dataSet = target.dataset.thumb;
        this.classCleaner(imgs, 'active-img');
        document.querySelector(`[data-img=${dataSet}]`).parentElement.classList.add('active-img');
        const initial = this.update(imgs);
        this.thumbUpdater(imgs, initial);
    };
};

const images = document.querySelectorAll('.images .img');
const buttons_ = [
    document.querySelector('.next'),
    document.querySelector('.prev'),
];
const slider = new Slider(buttons_, images, 0, 5000, true);
slider.run();

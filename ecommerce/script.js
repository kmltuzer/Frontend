
class Dbase {                                       // SUPPOSING LOCALSTORAGE IS A DATABASE.. LOL
    constructor (url, setName, cloneAttr) {
        this.url = url;
        this.setName = setName;
        this.cloneAttr = cloneAttr;
        this.clone = [];
        this.wrappers = [];
        this.other
    };

    async fetchData () {
        const response  = await fetch(this.url)
        const toJson    = await response.json()
        localStorage.setItem(`${this.setName}`, JSON.stringify(toJson));
        this.data = JSON.parse( localStorage.getItem(`${this.setName}`) )
        return this.data
    };

    async getData () {
        if (localStorage.getItem(`${this.setName}`) === null) await this.fetchData()
        else this.data = JSON.parse( localStorage.getItem(`${this.setName}`) );
        this.cloner()
    }
    cloner () {
        this.data['products'].forEach( (arg, index) => {
            const cln = document.querySelector(`${this.cloneAttr}`).cloneNode(true)
            this.clone.push(cln)
            const ctg = document.querySelector(`#${arg.category}`);                 
            if ( !this.wrappers.includes(ctg) ) this.wrappers.push(ctg);

            if ( ctg.id === arg.category ) {
                this.clone[index].querySelector('.prd-id').id = arg.id
                this.clone[index].querySelector('.prd-title').textContent = arg.title
                this.clone[index].querySelector('.prd-img img').src = arg.thumbnail
                this.clone[index].querySelector('.prd-info').textContent = arg.description
                this.clone[index].querySelector('.prd-price').textContent = arg.price + "$"
                this.clone[index].classList.add('grid')
                this.clone[index].classList.remove('d-none')
                this.clone[index].classList.remove('clone')
                ctg.appendChild(this.clone[index])
            };     
        });        
        this.wrappers.forEach( (wrp, index) => {
            if (index === 0 )wrp.querySelector('.prd-card:nth-child(3)').classList.add('active-card')
            else wrp.querySelector('.prd-card:nth-child(2)').classList.add('active-card')
        });
    };
};

const url = 'https://dummyjson.com/products'                    // Getting Products
const dBase = new Dbase(url, 'products','.prd-card');
const products = await dBase.getData()

// THE 'ADD TO BASKET BUTTON IN CARDS'

class Basket {
    constructor (amount, clone, basket, prices_, sum, up, down, id) {
        this.amount = amount;
        this.clone = clone;
        this.basket = basket;
        this.prices_ = prices_;
        this.sum = sum;
        this.up = up;
        this.down = down;
        this.id = id;
        this.doesExist;
    };
    run(e) {
        let targetId = e.parentElement.querySelector(`span${this.id}`).id
        const clone = document.querySelector(`${this.clone}`).cloneNode(true);    
        const numb = document.querySelector(`${this.amount}`);
        
        this.basketItemBuilder(e, clone, numb, targetId);

        clone.querySelector(`${this.up}`).addEventListener('click', (e) => this.increaseAmount(e, clone, numb) )       
        clone.querySelector(`${this.down}`).addEventListener('click', (e) => this.decreaseAmount(e, clone, numb) )
    };
    basketItemBuilder (e, clone, numb, id) {     
        clone.querySelector('.prd-basket-title').textContent = e.parentElement.querySelector('.prd-title').textContent
        clone.querySelector('.prd-basket-info').textContent = e.parentElement.querySelector('.prd-info').textContent
        clone.querySelector('.prd-basket-price').textContent = e.parentElement.querySelector('.prd-price').textContent
        clone.querySelector('.prd-basket-id').id = e.parentElement.querySelector('.prd-id').id
        clone.querySelector('.basket-amount-area').style.display = "flex";
        clone.style.display = "flex";

        this.intoBasket(clone, id, numb)
        this.sumUpdater(clone, numb)
    };
    increaseAmount (e, clone, numb) {
        clone.querySelector('input').value = +clone.querySelector('input').value + 1
        this.sumUpdater(clone, numb)
    };
    decreaseAmount (e, clone, numb) {
        clone.querySelector('input').value = +clone.querySelector('input').value - 1
        this.sumUpdater(clone, numb)             
    };
    intoBasket (clone, id, numb) {
        if ( !this.basketController(id) ) {
            document.querySelector(`${this.basket}`).appendChild(clone)
            numb.textContent = +numb.textContent + 1

        }else {
            this.doesExist = true;
        }        
    };
    sumUpdater (clone, numb) {
        const [...prices] = document.querySelectorAll('.basket .prd-basket-price');
        const sumInfo = document.querySelector('.basket-sum')
        if (sumInfo.textContent !== undefined) {
            let sum = 0;
            prices.forEach( acc => {                // the reduce method didn't work :/
                    sum += +acc.textContent.slice(0,-1) * +acc.parentElement.querySelector('input').value;
                }, 0);
            sumInfo.textContent = `${sum}$`
        };
        this.updateAmount(clone, numb)
        this.classSetter(numb)                           
    };
    updateAmount (param, numb) {
        if ( +param.querySelector('input').value == 0 ) {
            param.parentElement.removeChild(param);
            numb.textContent = +numb.textContent - 1
        }
    };
    classSetter (numb) {
        const bSum = document.querySelector(`${this.sum}`)

        if ( (+bSum.textContent.slice(0,-1) !== 0) && (+numb.textContent !== 0) ) {
            numb.classList.add('flex');
            numb.classList.remove('d-none');

            bSum.classList.add('flex');
            bSum.classList.remove('d-none');
            document.querySelector(`${this.basket}`).classList.remove('drv-away');
    
        } else {
            numb.classList.remove('flex');
            numb.classList.add('d-none');

            bSum.classList.remove('flex');
            bSum.classList.add('d-none');
            document.querySelector(`${this.basket}`).classList.add('drv-away');
        
        };
    };
    basketController(id) {
        const basketItems = document.querySelectorAll('.prd-basket-id')
        let elm;
        basketItems.forEach( elem => {
            elem.id == id ?  (this.doesExist = true) && (elm = elem) : (this.doesExist = false);
        });
        if ( elm !== undefined && this.doesExist ) {
            elm.parentElement.querySelector('input').value = +elm.parentElement.querySelector('input').value + 1
        } 
        if (basketItems.length === 0) return false
        return this.doesExist;
    };
};

const bskt = new Basket(
    '.basket span.prds-numb', 
    '.prd-basket', 
    '.basket-hover', 
    '.prd-basket-price',
    '.basket-sum',
    '.amount-up',
    '.amount-down',
    '.prd-id'
);
document.querySelectorAll(`.add-bskt`).forEach( btn => btn.addEventListener('click', e => bskt.run (e.target) ) );


// USER LOGIN & SIGNUP

class User {
    #password;
    #email;
    constructor (forms, other) {
        this.forms = forms
        this.firstname;         //this.forms[0].querySelector('input:nth-child(1)').value
        this.lastname;          //this.forms[0].querySelector('input:nth-child(2)').value
        this.username;
        this.other = other;
        this.loggedIn = false;
    };
    async dBase () {
        if (!localStorage.users) {
            const response = await fetch('https://jsonplaceholder.typicode.com/users')
            const data = await response.json()
            localStorage.users = JSON.stringify(data);
            
            return false
        }
        return true // JSON.parse(localStorage.users);
    }
    login (e) {
        this.forms.forEach( (form, index) => index !== 1 ? form.style.display = 'none' : form.style.display = 'flex' );
    }
    signup (e) {
        this.forms.forEach( (form, index) => index !== 0 ? form.style.display = 'none' : form.style.display = 'flex' );
    }
    reset (e) {
        this.forms.forEach( (form, index) => index !== 2 ? form.style.display = 'none' : form.style.display = 'flex' );
        const [logForm, regForm] = this.forms

        logForm.querySelectorAll('label input').forEach( input => input.value = "")
        regForm.querySelectorAll('label input').forEach( input => input.value = "")
        document.querySelectorAll('label i').forEach( i => i.classList.remove('fa-check') );
        logForm.querySelectorAll('label p').forEach( form => form.textContent = "" );
        regForm.querySelectorAll('label p').forEach( form => form.textContent = "" );
        document.querySelectorAll('.result-info').forEach( info => info.textContent = '' );
        document.querySelector('.overlay .conf-code-info').innerHTML = '';
        document.querySelector('.overlay .fa-solid').classList.remove('fa-check');

    }
    async loginCheck () {
        const response = await this.dBase()
        let where;
        let emailVal;
        let passwVal;
        if ( this.other ) {
            emailVal = document.getElementById('log-email').value
            passwVal = document.getElementById('log-passw').value
            where = '.login-form'
        } else {
            emailVal = document.getElementById('hm-log-email').value
            passwVal = document.getElementById('hm-log-passw').value
            where = '.hm-log-form'; 
        }

        if ( response ) {
            const users = JSON.parse(localStorage.getItem('users'))
            let logRequirements = users.some( usr =>  usr.password === passwVal && usr.email === emailVal )
            
            if ( logRequirements ) {

                document.querySelector(`${where} .log-email-info`).parentElement
                    .querySelector('i').classList.add('fa-check');
                document.querySelector(`${where} .log-passw-info`).parentElement
                    .querySelector('i').classList.add('fa-check');
                document.querySelector(`${where} .result-info`).textContent = 'Success!'
                document.querySelector(`${where} .result-info`).style.color = 'var(--blue)'
                document.querySelector(`${where} .result-info`).style.fontSize = '1.1rem'

                this.loggedIn = true

            } else {
                document.querySelector(`${where} .result-info`).textContent = '*Invalid username or password';
                document.querySelector(`${where} .result-info`).style.color = 'var(--red)';
                document.querySelector(`${where} .result-info`).style.fontSize = '1rem';
                document.querySelector(`${where} .result-info`).style.fontWeight = 'normal';
                document.querySelector(`${where} .log-email-info`).parentElement
                    .querySelector('i').classList.remove('fa-check');
                document.querySelector(`${where} .log-passw-info`).parentElement
                    .querySelector('i').classList.remove('fa-check');
                
                this.loggedIn = false
            };
        };    
    };
    async registerCheck (e) {
        const response  = await this.dBase()
        const reEmail   = /^[A-Za-z](\w*[.-]?\w*)@{1}\w+([.]{1}[A-Za-z]{2,4}|(\.{1}[A-Za-z]{2}){2})$/
        const reNames   = /^[A-Z][a-z]{3,12}$/
        const rePassw   = /\w{7,50}/
        let inputs;
        if ( this.other ) [...inputs] = document.querySelectorAll('.register-form input')
        else [...inputs] = document.querySelectorAll('.hm-reg-form input');

        this.firstname = inputs[0].value
        this.lastname = inputs[1].value
        this.#email = inputs[2].value
        this.#password = inputs[3].value

        if ( !reNames.test(inputs[0].value) ) inputs[0].parentElement.querySelector('p').innerHTML = "*Invalid name"
        else inputs[0].parentElement.querySelector('p').innerHTML = ""
        if ( !reNames.test(inputs[1].value) ) inputs[1].parentElement.querySelector('p').innerHTML = "*Invalid name"
        else inputs[1].parentElement.querySelector('p').innerHTML = ""
        if ( !reEmail.test(inputs[2].value) ) inputs[2].parentElement.querySelector('p').innerHTML = "*Invalid email"
        else if ( this.emailCheck() ) inputs[2].parentElement.querySelector('p').innerHTML = "*This email has already exist"
        else inputs[2].parentElement.querySelector('p').innerHTML = ""
        if ( !rePassw.test(inputs[3].value) ) inputs[3].parentElement.querySelector('p').innerHTML = "*Invalid password"
        else inputs[3].parentElement.querySelector('p').innerHTML = ""
        if ( 
                reNames.test(inputs[0].value) && reNames.test(inputs[1].value) &&
                reEmail.test(inputs[2].value) && rePassw.test(inputs[3].value) && !this.emailCheck()
            ) {
                e.parentElement.querySelector('.result-info').textContent = "Success";
                inputs.forEach( inp => inp.parentElement.querySelector('i').classList.add('fa-check') )
                return true
                
            } else return false
    };
    userCreator() {
        this.idGenerator()
        if ( this.idCheck() ) {
            const users = JSON.parse(localStorage.users)
            const [firstname, lastname, email, password, id] = [
                this.firstname, 
                this.lastname, 
                this.#email, 
                this.#password,
                this.id
            ]
            const user = {
                firstname,
                lastname,
                email,
                password,
                id
            };
            users.push(user)
            localStorage.users = JSON.stringify(users);
            return true

        } else return false
    };
    idGenerator (leng = 15) {
        let id = [];
        const pangram = "The quick brown fox jumps over the lazy dog";
        const numbers = [0,1,2,3,4,5,6,7,8,9]
        const alphLower = pangram.toLowerCase().split(" ").join("").split("").sort()
        const alphUpper = pangram.toUpperCase().split(" ").join("").split("").sort()
        const group = [numbers, alphLower, alphUpper]
        while (id.length < leng ) {
            const randCharIndex = Math.floor( Math.random() * 3 )
            const randIndex = Math.floor( Math.random() * group[randCharIndex].length );
            if ( !id.includes( group[randCharIndex][randIndex] ) ) id.push( group[randCharIndex][randIndex] )
            else continue;
        };
        return this.id = id.join("");
    };
    idCheck () {
        let result;
        const users = JSON.parse(localStorage.users);
        if ( users ) result = !users.some( user => (user.id === this.id) );
        else result = false;

        if ( !result ) this.idGenerator()
        else return true
        
        return result;
    };
    emailCheck() {
        const users = JSON.parse(localStorage.users)
        return users.some( user => user.email === this.email )
    }
};


class Confirmation {                                    // SUPPOSING CONSOLE.LOG IS A MAILBOX. LOL..
    constructor (ms, strokeDO, submitBtn, closeBtn, delay, user, result) {
        this.ms = ms;
        this.strokeDO = strokeDO;
        this.overlay = document.querySelector('.overlay')
        this.circle = this.overlay.querySelector('#stk-offset')
        this.info = this.overlay.querySelector('.count-info')
        this.submitBtn = submitBtn;
        this.closeBtn = closeBtn;
        this.delay = delay;
        this.resend = false;
        this.result = result
        this.user = user;
        this.reset()
        this.code = this.randomCodeGen()

        this.overlay.querySelector(`${this.closeBtn}`).addEventListener('click', (e) => {
            this.overlay.classList.add('d-none');
            this.reset();
        } );
        const ms_ = this.ms
        setTimeout( () => this.overlay.classList.remove('d-none'), this.delay );
        this.interval = setInterval( () => this.counter(ms_), 1000);

        if (this.result) this.overlay.querySelector(`${this.submitBtn}`).addEventListener('click', e =>  {
            if ( this.confCheck() ) this.user.userCreator();
        } );
    };
    reset () {
        clearInterval(this.interval)
        this.overlay.querySelector('.circles').classList.remove('d-none')
        this.overlay.querySelector('.conf-code-info').innerHTML = ''
        this.overlay.querySelector('.conf-code-info').style.textAlign = "start";
        this.overlay.querySelector('.fa-solid').classList.remove('fa-check');
        this.overlay.querySelector('.timer input').value = ''
        this.overlay.querySelector(`${this.submitBtn}`).style.backgroundColor = "var(--blue)";
        this.circle.style.strokeDashoffset = this.strokeDO;
        this.circle.style.stroke = 'var(--blue)';
        this.resend = false;
        this.id = NaN;
    };
    counter (ms) {
        this.circle.style.strokeDashoffset = this.strokeDO - (this.strokeDO * this.ms) / (ms + 1)
        this.info.innerHTML = this.ms--
        const mscheck = +this.info.textContent
        if (mscheck <= 0) {
            clearInterval(this.interval)
            this.resend = true 
            this.confCheck()

        } else this.resend = false;

    
        if (this.ms < 15) {
            this.circle.style.stroke = "var(--red)";
            this.overlay.querySelector(`${this.submitBtn}`).style.backgroundColor = "var(--red)";
        }
    };
    confCheck(e) {
        const value = this.code === this.overlay.querySelector('.timer input').value
        if ( value && !this.resend ) {
            this.overlay.querySelector('.circles').classList.add('d-none')
            this.overlay.querySelector('.conf-code-info').innerHTML = 'Success'
            this.overlay.querySelector('.conf-code-info').style.color = "#2b9348";
            this.overlay.querySelector('.conf-code-info').style.textAlign = "center";
            this.overlay.querySelector('.fa-solid').classList.add('fa-check');
            return true

        } else if ( (!value && this.resend) || (value && this.resend) ) {
            this.overlay.querySelector('.conf-code-info').style.color = "var(--red)";
            this.overlay.querySelector('.circles').classList.add('d-none');
            clearInterval(this.interval);
            this.overlay.querySelector('.conf-code-info').innerHTML = '*You did not type the code'
            return false
        } else {
            if (this.overlay.querySelector('input').value.length > 0 ) {
                this.overlay.querySelector('.circles').classList.add('d-none')
            }
            this.overlay.querySelector('.conf-code-info').innerHTML = '*Invalid code'
            this.overlay.querySelector('.conf-code-info').style.color = "var(--red)";
            this.overlay.querySelector('.conf-code-info').style.textAlign = "start";
            this.overlay.querySelector('.fa-solid').classList.remove('fa-check');
            return false
        };
    };
    randomCodeGen (length = 3) {
        const chars = [];
        const pangram = "The quick brown fox jumps over the lazy dog";
        const numbers = [0,1,2,3,4,5,6,7,8,9]
        const alphabet = pangram.toUpperCase().split(" ").join("").split("").sort().join("")
        while ( chars.length !== length ) {
            const randomNumb = Math.floor(Math.random() * numbers.length);
            const randomLett = Math.floor(Math.random() * alphabet.length);
            const confCode = `${numbers[randomNumb]}${alphabet[randomLett]}`;
            if (chars.includes(confCode)) continue
            else chars.push(confCode); 
        };
        this.code = chars.join("");
        console.log(this.code)
        return this.code
    };
    resendCode() {

    };
};

const userArea = [
    document.querySelector('.usr-login'),
    document.querySelector('.login-btn'),
    document.querySelector('.signup-btn')
];
const forms = [
    document.querySelector('.register-form'),
    document.querySelector('.login-form'),
    document.querySelector('.choice')
];
userArea[1].addEventListener('click', e =>  {
    const usr = new User(forms)
    usr.login(e.target)
} )
userArea[2].addEventListener('click', e => {
    const usr = new User(forms)
    usr.signup(e.target)
} )
userArea[0].addEventListener('mouseleave', e => {
    const usr = new User(forms)
    usr.reset(e.target);

} );

new User(forms, null).dBase()
document.querySelector('.log-submit-btn').addEventListener('click', (e) => {
    const usr = new User(forms, true)
    usr.loginCheck(e.target)
    e.preventDefault();
});
document.querySelector('.reg-submit-btn').addEventListener('click', async (e) => {
    const usr = new User(forms, true)
    const result = await usr.registerCheck(e.target)
    if ( result ) {
        const confCode = new Confirmation(60, 128, '.conf-btn', '.cls-overlay-btn', 1500, usr, true)
        confCode.result = true;
    }
    e.preventDefault();
});

document.querySelector('.hm-log-submit-btn').addEventListener('click', (e) => {
    const usr = new User(forms, false)
    usr.loginCheck(e.target)
    e.preventDefault();
});
document.querySelector('.hm-reg-submit-btn').addEventListener('click', async (e) => {
    const usr = new User(forms, false)
    const result = await usr.registerCheck(e.target)
    if ( result ) {
        const confCode = new Confirmation(60, 128, '.conf-btn', '.cls-overlay-btn', 1500, usr, true)
        confCode.result = true;
    }
    e.preventDefault();
});


// SLIDER AREA
class Slider{
    constructor (imgs, dots, prevBtn, nextBtn, ms, auto, initial, step) {
        this.imgs = [...imgs];
        this.dots = [...dots]
        this.prevBtn = prevBtn
        this.nextBtn = nextBtn
        this.ms = ms
        this.initial = initial
        this.step = step
        this.max = this.imgs.length - 1
        this.active = this.initial;

        if ( auto ) {
            setInterval( () => {
                this.active = this.gen('+').next().value
                this.slideManager(this.active);
            }, ms)
        };
    };
    slideManager (param) {
        this.active = param;
        this.imgs.forEach( (img, index) => {
            if (param === index) {
                this.imgs[param].classList.remove('d-none')
                this.imgs[param].classList.add('active')
                document.querySelector(`[sl-id="${param}"]`).classList.add('active-dot');
            }
            else {
                this.imgs[index].classList.remove('active')
                this.imgs[index].classList.add('d-none')
                document.querySelector(`[sl-id="${index}"]`).classList.remove('active-dot');
            }
        });
    };
    * gen (operator) {          
        switch(operator) {
            case "+" :
                if ( this.active >= this.max )  yield this.active = 0
                yield this.active += this.step;            
                
            case "-" :
                if ( this.active <= 0 ) yield this.active = this.max
                yield this.active -= this.step;            
        };
    };
};

const dots = document.querySelectorAll('.sl-dots .sl-dot-wrap');
const sliderImgs = document.querySelectorAll('.slider')
const prevBtn = document.querySelector('.sl-buttons i:nth-child(1)')
const nextBtn = document.querySelector('.sl-buttons i:nth-child(2)')

const slider = new Slider(sliderImgs, dots, prevBtn, nextBtn, 9000, true, 0, 1);

prevBtn.addEventListener('click', () => {
    const val = slider.gen('-').next().value;
    slider.slideManager(val)
});
nextBtn.addEventListener('click', () => {
    const val = slider.gen('+').next().value;
    slider.slideManager(val)
});
dots.forEach( dot => dot.addEventListener('click', e => {
    const val = +e.target.getAttribute('sl-id')
    slider.slideManager(val);
}));


// HAMBURGER MENU
const miniReset = () => {
    document.querySelectorAll('ul li label input').forEach( input => input.value = '' )
    document.querySelectorAll('ul p').forEach( p => p.textContent = '' )
}
function openMenu (e) {
    document.querySelector('.hm-menu-links').classList.toggle('d-none');
    document.querySelector('.hm-menu-cont i').classList.toggle('fa-bars');
    document.querySelector('.hm-menu-cont i').classList.toggle('fa-x');
    document.querySelector('.hm-log-form').classList.add('d-none');
    document.querySelector('.hm-reg-form').classList.add('d-none');
    document.querySelector('.pop-out').classList.remove('d-none')
    document.querySelector('.hm-ctgs').classList.remove('d-none')
    miniReset()
}
const hmMenu = document.querySelector('.hm-menu-cont').addEventListener('click', openMenu)

document.querySelector('.log-reg .hm-reg').addEventListener('click', (e) => {
    document.querySelector('.hm-log-form').classList.add('d-none');
    document.querySelector('.hm-reg-form').classList.remove('d-none');
    document.querySelector('.pop-out').classList.add('d-none')
    document.querySelector('.hm-ctgs').classList.add('d-none')
    miniReset()

    e.preventDefault();
});
document.querySelector('.log-reg .hm-log').addEventListener('click', (e) => {
    document.querySelector('.hm-reg-form').classList.add('d-none');
    document.querySelector('.hm-log-form').classList.remove('d-none');
    document.querySelector('.pop-out').classList.add('d-none')
    document.querySelector('.hm-ctgs').classList.add('d-none')
    miniReset()

    e.preventDefault();
});
// SLIDING PRODUCTS
const nextBtns = document.querySelectorAll('[class^=ctg-] .next-prd')
const prevBtns = document.querySelectorAll('[class^=ctg-] .prev-prd')
document.querySelector('.clone').remove()

function* nextprev(val, opr, max, initial) {
    switch (opr) {
        case '+' :
            if ( val >= max ) yield val = initial
            yield val +=1        
        case '-' :
            if ( val <= initial ) yield val = max
            yield val -=1        
    }
};

function check (arg, index) {
    if (val_ === index ) arg.classList.add('active-card')
    else arg.classList.remove('active-card')
}

let val_ = 0
function next(e) {
    val_ = nextprev(val_, '+',4, 0).next().value;
    e.target.parentElement.parentElement.querySelectorAll('.prd-card').forEach( check );
};
nextBtns.forEach (btn => btn.addEventListener('click', next) )

function prev(e) {
    val_ = nextprev(val_, '-',4, 0).next().value
    e.target.parentElement.parentElement.querySelectorAll('.prd-card').forEach( check );
};
prevBtns.forEach (btn => btn.addEventListener('click', prev) )















// console.log(document.querySelector(`[sl-id="3"]`))           // <-- To get an element by a specific attribute

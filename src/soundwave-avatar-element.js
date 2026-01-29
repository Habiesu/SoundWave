class SoundWaveAvatar extends HTMLElement {
    constructor() {
        super();  // llamar al constructor de HTMLElement
        // Para aplicar el shadowRoot debo colocar esto: 
        this.attachShadow({ mode: 'open'});
    }
    createUrl(service, username){
        // return `https://unavatar.io/${service}/${username}?fallback=https://avatar.vercel.sh/48t?size=400`
        return `https://unavatar.io/${service}/${username}`;
    }

    render(){
        // Si quiero aislarlo para que ningún atributo de afuera influya en él, puedo usar el shadowRoot
        const service = this.getAttribute('service') ?? 'github';
        const username = this.getAttribute('username') ?? 'habiesu';
        const size = this.getAttribute('size') ?? '40'; 
        // Para el tema de la url se puede hacer sin crear una constante con el url usando <img src="${this.createUrl(service, username)}" y de esa forma hacerlo más "directo", lo haré como hizo midu que fué así:
        const url = this.createUrl(service, username);
        this.shadowRoot.innerHTML = `
        <style>
            img{
                height: ${size}px;
                width: ${size}px;
                border-radius: 9999px;
                cursor: pointer;
                display: flex;
                align-items: center;
            }
        </style>
        
        <img src="${url}"
            alt="Avatar de Habiesu"
        />`;

        // Forma sin shadow DOM
        // this.innerHTML = `
        // <img src="https://avatars.githubusercontent.com/u/104993826?=4"
        //     alt="Avatar de Habiesu"
        //     class="avatar"
        // />`;
    }

    connectedCallback() {
        this.render()
    }

}

customElements.define('soundwave-avatar', SoundWaveAvatar);


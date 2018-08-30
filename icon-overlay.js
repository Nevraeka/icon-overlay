(function (document, window) {
  if(!window || !document) { return; }
  if(!window.customElements || !HTMLElement.prototype.attachShadow) {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.2.0/webcomponents-sd-ce.js', loadImgIcon)
  } else {
    loadImgIcon(); }

    (function () {
      if ( typeof window.CustomEvent === "function" ) { return false; }

      function CustomEvent ( event, params ) {
        params = params || { bubbles: true, cancelable: false, composed: true, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail, params.composed );
        return evt;
       }

      CustomEvent.prototype = window.Event.prototype;

      window.CustomEvent = CustomEvent;
    })();

  function loadScript(url, callback){
    const script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState){
      script.onreadystatechange = function(){
        if (script.readyState === "loaded" || script.readyState === "complete"){
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      script.onload = function (){ callback() };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  function loadImgIcon(){
    loadScript('https://cdn.rawgit.com/Nevraeka/img-icon/master/img-icon.js', loadComponent);
  }
  
  function loadComponent() {
    if (!window.customElements.get('icon-overlay')) {
  
      class IconOverlay extends HTMLElement {

        static get deps(){
          return [{
            element: 'img-icon',
            source: 'https://cdn.rawgit.com/Nevraeka/img-icon/master/img-icon.js'
          }]; 
        }

        constructor() {
          super();
          this._root = null;

          this.state = {
            icon: null
          };
        }
        
        get icon() { return this.state.icon; }

        connectedCallback(){

          if (this._root === null) {
            this._root = this.attachShadow({ mode: "open" });
          } else { 
            this._root = this;
          }

          render(this);
          updatePosition(this, this.getAttribute('position') || '');
        }
        
        attributeChangedCallback(name, oldVal, newVal) {
          if (oldVal === newVal) { return; }
          if(name === 'icon') { this.state.icon = newVal; }
          if(name === 'position') {
            updatePosition(this, newVal);
          }
        }
        
      }

      window.customElements.define('icon-overlay', IconOverlay );
    }
  }

  function updatePosition(component, value){
    component.removeAttribute('style');
    if (value) {
      component.style.setProperty('--icon-overlay--position', 'absolute');
      const positions = value.split(' ');
      positions.forEach((styl) => {
        if(/(bottom)|(top)|(left)|(right)/.test(value)) {
          component.style.setProperty(`--icon-overlay--${styl}`, '0px');
        }
        if(/(center)/.test(value)) {
          component.style.setProperty('--icon-overlay--left', 'calc(50% - 16px)');
        }
        if(/(middle)/.test(value)) {
          component.style.setProperty('--icon-overlay--top', 'calc(50% - 16px)');
        }
      });
    }
  }
  function render(component) {
    if(!component._root) { return; }
    if (window.ShadyCSS) { ShadyCSS.styleElement(component); }

    let $template = document.createElement('template');
    $template.innerHTML = `
      <style>
        :host {
          --img-icon--color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          padding: 8px;
          background-color: rgba(0,0,0, .7);
          background-color: var(--icon-overlay--bkg, rgba(0,0,0, .7));
          position: var(--icon-overlay--position, 'static');
          top: var(--icon-overlay--top);
          left: var(--icon-overlay--left);
          right: var(--icon-overlay--right);
          bottom: var(--icon-overlay--bottom);
        }
      </style>
      <img-icon fill="100" shape="${component.getAttribute('icon') || ''}"></img-icon>
    `;

    if (window.ShadyCSS) { ShadyCSS.prepareTemplate($template, 'icon-overlay'); }
    component._root.appendChild(document.importNode($template.content, true));
  }

})(document, window);
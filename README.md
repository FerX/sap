Istruzioni

Inserire il codice sul plugin di chrome USER JAVASCRIPT AND CSS

var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://cdn.jsdelivr.net/gh/Subbacqueo/sap@Subbacqueo/sap.js';    
document.getElementsByTagName('head')[0].appendChild(script);

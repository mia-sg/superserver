let allowLog= true;

function error( pCode, pMessage ) 
{
    console.error({"cod": pCode, "messages": pMessage });
    console.trace();
}

function uuidv4() 
{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


function elID() 
{
    return 'afxxx_yxxx_xxxxfa'.replace(/[x]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * @function htmlToElement - Create a html node from html string.
 * @param pHtml - A stirng of html.
 * @return {HTMLElement} -  A HTMLElement node which is created of the HTML string.
 */
function htmlToElement( pHtml ) 
{
    var template = document.createElement('template');
    template.innerHTML = pHtml;
    return template.content.childNodes[0];
}

/**
 * @function attrsToOptions - Create an object from node attribures. Change the snake-format to the camelFormat of an attribute.
 * @return {name: value}
 */
function attrsToOptions( pAttrs )
{
    let obj = {};
    for( const[ k, v ] of  Object.entries( pAttrs ) ) {
        let _v = v.value;
        if( typeof _v === "string" ) {
            if( _v.length === 0 || _v === 'false' ) _v = false;
            else if( _v === 'true' ) _v = true;
        }
        if( typeof _v === 'number' ) {
            if( _v === 0 ) _v = false;
            else if( _v === 1) _v = true;
        }
        obj[ v.name.replace(/(-)(?<=-)[a-z]/g, (a)=>{ return a.toUpperCase() } ).split('-').join('').trim() ] = _v ;
    }

    return obj;
}


function parseCookie( str ){
    return str
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
}

export {
    error,
    uuidv4,
    htmlToElement,
    attrsToOptions,
    elID,
    parseCookie
}
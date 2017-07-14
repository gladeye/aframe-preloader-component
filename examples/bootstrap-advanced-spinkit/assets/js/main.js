function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

$(document).ready(function(){

    var spinkitClass = getQueryVariable('class');

    if(spinkitClass){
        var $spinnerEl = $('.preloader-modal__spinner');
        //choose an animation based on 'class' url var
        $spinnerEl.removeClass('sk-rotating-plane').addClass(spinkitClass);

        switch(spinkitClass){
            case 'sk-double-bounce':
                $spinnerEl.html($('<div class="sk-child sk-double-bounce1"></div><div class="sk-child sk-double-bounce2"></div>'));
                break;
            case 'sk-wave':
                $spinnerEl.html($('<div class="sk-rect sk-rect1"></div><div class="sk-rect sk-rect2"></div><div class="sk-rect sk-rect3"></div><div class="sk-rect sk-rect4"></div><div class="sk-rect sk-rect5"></div>'));
                break;
            case 'sk-wandering-cubes':
                $spinnerEl.html($('<div class="sk-cube sk-cube1"></div><div class="sk-cube sk-cube2"></div>'));
                break;
            case 'sk-chasing-dots':
                $spinnerEl.html($('<div class="sk-child sk-dot1"></div><div class="sk-child sk-dot2"></div>'));
                break;
            case 'sk-three-bounce':
                $spinnerEl.html($('<div class="sk-child sk-bounce1"></div><div class="sk-child sk-bounce2"></div><div class="sk-child sk-bounce3"></div>'));
                break;
            case 'sk-cube-grid':
                $spinnerEl.html($('<div class="sk-cube sk-cube1"></div><div class="sk-cube sk-cube2"></div><div class="sk-cube sk-cube3"></div><div class="sk-cube sk-cube4"></div><div class="sk-cube sk-cube5"></div><div class="sk-cube sk-cube6"></div><div class="sk-cube sk-cube7"></div><div class="sk-cube sk-cube8"></div><div class="sk-cube sk-cube9"></div>'));
                break;
            case 'sk-folding-cube':
                $spinnerEl.html($('<div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div>'));
                break;
            case 'sk-pulse':
                //nothing to add
                break;
            case 'sk-circle':
            case 'sk-fading-circle':
                //not supported
                console.error('Spinkit sk-circle and sk-fading-circle are not supported!');
                break;
            default:
                break;
        }
    }


});
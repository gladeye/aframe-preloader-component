/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	/* global AFRAME */

	if (typeof AFRAME === 'undefined') {
	    throw new Error('Component attempted to register before AFRAME was available.');
	}

	// First, checks if it isn't implemented yet.
	if (!String.prototype.format) {
	    String.prototype.format = function() {
	        var args = arguments;
	        return this.replace(/{(\d+)}/g, function(match, number) {
	            return typeof args[number] != 'undefined'
	                ? args[number]
	                : match
	                ;
	        });
	    };
	}

	/**
	 * Visual preloader system for A-Frame.
	 *
	 * When applied to the <scene> will automatically display a preloader modal that reflects the current loading progress
	 * of resources in <a-assets> that have been flagged for preloading and will auto-close the modal when it reaches 100%.
	 * Alternately, the modal can be manually closed
	 *
	 * Emits a 'preloading-complete' event when done.
	 */
	AFRAME.registerSystem('preloader', {
	    schema: {
	        type: { type: 'string', default: 'bootstrap' }, //type of CSS framework to use - acceptable values are: 'bootstrap' or 'custom'
	        id: {type: 'string', default: 'preloader-modal'}, //ID of the auto injected preloader modal
	        autoInject: { type: 'boolean', default: true }, //whether or not to auto-inject the preloader html into the page
	        target: { type: 'selector', default: '#preloader-modal'}, //the html target selector
	        progressValueAttr:  { type: 'string', default: 'aria-valuenow' },//an attribute of the progress bar to set when progress is updated
	        barProgressStyle: { type: 'string', default: 'width'}, //target css style to set as a percentage on the bar
	        bar: { type: 'selector', default: '#preloader-modal .progress-bar'}, //html class of progress bar in preloader - used to set the width
	        label: { type: 'selector', default: '#preloader-modal .progress-label'}, //html class of label in preloader - used to set the percentage
	        labelText: { type: 'string', default: '{0}% Complete'}, //loading text format {0} will be replaced with the percent progress e.g. 30%
	        autoClose: { type: 'boolean', default: true}, //automatically close preloader by default - not supported if clickToClose is set to 'true'
	        clickToClose: { type: 'boolean', default: false}, //whether the user must click a button to close the modal when preloading is finished
	        closeLabelText: { type: 'string', default: 'Continue'}, //default label text of click to close button
	        title: { type: 'string', default: ''}, //title of preloader modal
	        debug: { type: 'boolean', default: false}, //whether or not to enable logging to console
	        disableVRModeUI: { type: 'boolean', default: true}, //whether or not to disable VR Mode UI when preloading
	        slowLoad: { type: 'boolean', default: false}, //deliberately slow down the load progress by adding 2 second delays before updating progress - used to showcase loader on fast connections and should not be enabled in production
	        doneLabelText: { type: 'string', default: 'Done'} //text to set on label when loading is complete
	    },

	    /**
	     * Set if component needs multiple instancing.
	     */
	    multiple: false,

	    loadedAssetCount: 0, //total number of assets loaded
	    totalAssetCount: 0, //total number of assets to load
	    slowLoadTimeAssetUpdate: 1000, //length of time to slow down asset load progress if slowLoad is set to 'true'
	    slowLoadTimePreloadFinish: 4000, //length of time to slow down preload finish if slowLoad is set to 'true'

	    /**
	     * Called once when component is attached. Generally for initial setup.
	     */
	    init: function () {

	        if(this.data.debug){
	            console.log('Initialized preloader');
	        }

	        if(this.data.type === 'bootstrap' && typeof $ === 'undefined'){
	            console.error('jQuery is not present, cannot instantiate Bootstrap modal for preloader!');
	        }

	        document.querySelector('a-assets').addEventListener('loaded',function(){
	            if(this.data.debug){
	                console.info('All assets loaded');
	            }
	            this.triggerProgressComplete();

	        }.bind(this));

	        var assetItems = document.querySelectorAll('a-assets a-asset-item,a-assets img,a-assets audio,a-assets video');

	        this.totalAssetCount = assetItems.length;

	        this.watchPreloadProgress(assetItems);

	        if(!this.data.target && this.data.autoInject){
	            if(this.data.debug){
	                console.info('No preloader html found, auto-injecting');
	            }
	            this.injectHTML();
	        }else{
	            switch(this.data.type){
	                case 'bootstrap':
	                    this.initBootstrapModal($(this.data.target));
	                    break;
	                default:
	                    //do nothing
	                    break;
	            }
	        }

	        if(this.data.disableVRModeUI){
	            this.el.setAttribute('vr-mode-ui','enabled','false');
	        }
	    },

	    /**
	     * Called when component is attached and when component data changes.
	     * Generally modifies the entity based on the data.
	     */
	    update: function (oldData) { },

	    /**
	     *
	     * @param assetItems A NodeList with a list of <a-asset-item> elements that you wish to watch
	     */
	    watchPreloadProgress: function(assetItems){
	        for (var a = 0; a < assetItems.length; a++) {

	            var eventName;

	            switch(assetItems[a].nodeName){
	                case 'A-ASSET-ITEM':
	                    eventName = 'loaded';
	                    break;
	                case 'img':
	                    eventName = 'load';
	                    break;
	                case 'audio':
	                case 'video':
	                    eventName = 'loadeddata';
	                    break;
	            }

	            assetItems[a].addEventListener(eventName,function(e){
	                this.loadedAssetCount++;
	                if(this.data.debug) {
	                    console.info('Loaded ' + this.loadedAssetCount + '/' + this.totalAssetCount + ' asset items');
	                }
	                this.onAssetLoaded();
	            }.bind(this));
	        }
	    },

	    onAssetLoaded: function(){
	        if(this.loadedAssetCount === this.totalAssetCount){
	            this.triggerProgressComplete();
	        }else{
	            var percentage = Math.floor(this.loadedAssetCount/this.totalAssetCount*100);
	            if(this.data.slowLoad) {
	                setTimeout(function () {
	                    this.drawProgress(percentage);
	                }.bind(this), this.slowLoadTimeAssetUpdate)
	            }else{
	                this.drawProgress(percentage);
	            }
	        }
	    },

	    triggerProgressComplete: function(){

	        if(this.data.slowLoad){
	            setTimeout(function(){
	                if(this.data.type === 'bootstrap') $(this.data.bar).addClass('progress-bar-success');
	                this.drawProgress(100);
	                this.data.target.classList.add('preloader-modal__complete');
	            }.bind(this),this.slowLoadTimePreloadFinish-1000);
	        }else{
	            if(this.data.type === 'bootstrap') $(this.data.bar).addClass('progress-bar-success');
	            this.drawProgress(100);
	            this.data.target.classList.add('preloader-modal__complete');
	        }

	        if(this.data.autoClose && !this.data.clickToClose){
	            if(this.data.slowLoad){
	                setTimeout(function(){
	                    this.triggerPreloadingComplete();
	                    this.closeModal();
	                }.bind(this),this.slowLoadTimePreloadFinish)
	            }else{
	                this.triggerPreloadingComplete();
	                this.closeModal();
	            }

	        }else{
	            if(this.closeBtn && this.data.clickToClose){
	                if(this.data.slowLoad){
	                    setTimeout(function(){
	                        this.closeBtn.setAttribute('style','display: inline-block');
	                    }.bind(this),this.slowLoadTimePreloadFinish)
	                }else{
	                    this.closeBtn.setAttribute('style','display: inline-block');
	                }

	            }
	        }
	    },

	    drawProgress: function(percentage){
	        //update loading bar if exists
	        if(this.data.label){
	            this.data.label.innerHTML = (percentage === 100) ? this.data.doneLabelText : this.data.labelText.format(percentage);
	        }

	        if(this.data.bar){
	            this.data.bar.setAttribute(this.data.progressValueAttr,percentage);
	            this.data.bar.setAttribute('style',this.data.barProgressStyle+':'+percentage+'%');
	        }
	    },

	    injectHTML: function(){
	        switch(this.data.type){
	            case 'bootstrap':
	                this.injectBootstrapModal();
	                break;
	            default:
	                //do nothing
	                break;
	        }
	    },

	    injectBootstrapModal: function(){

	        if(this.data.debug){
	            console.info('Injecting bootstrap modal');
	        }

	        if(!this.data.title){
	            //full screen modal
	            var $modal = $('' +
	                '<div id="'+this.data.id+'" class="modal instructions-modal" tabindex="-1" role="dialog">'+
	                '<div class="modal-dialog modal-dialog__full" role="document">'+
	                '<div class="modal-content vertical-align text-center">'+
	                '<div class="col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3">'+
	                '<div class="progress">'+
	                '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">'+
	                '<span class="progress-label">Loading 0% Complete</span>'+
	                '</div>'+
	                '</div>'+
	                ((this.data.clickToClose) ? '<button type="button" class="close-btn btn btn-default" data-dismiss="modal">Continue</button>' : '' )+
	                '</div>'+
	                '</div>'+
	                '</div>'+
	                '</div>'+
	                '');
	        }else{
	            //regular modal
	            var $modal = $('' +
	                '<div id="'+this.data.id+'" class="modal instructions-modal" tabindex="-1" role="dialog">'+
	                '<div class="modal-dialog modal-dialog__full" role="document">'+
	                '<div class="modal-content">'+
	                '<div class="modal-header">'+
	                '<h4 class="modal-title">'+this.data.title+'</h4>'+
	                '</div>'+
	                '<div class="modal-body">' +
	                '<div class="col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3">'+
	                '<div class="progress">'+
	                '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">'+
	                '<span class="progress-label">Loading 0% Complete</span>'+
	                '</div>'+
	                '</div>'+
	                '</div>'+
	                '</div>'+
	                '<div class="modal-footer">'+
	                ((this.data.clickToClose) ? '<button type="button" class="close-btn btn btn-default" data-dismiss="modal">Continue</button>' : '' )+
	                '</div>'+
	                '</div>'+
	                '</div>'+
	                '</div>'+
	                '');
	        }

	        $('body').append($modal);

	        this.data.target = $modal[0];
	        this.data.label = $modal.find('.progress-label')[0];
	        this.data.bar = $modal.find('.progress-bar')[0];

	        this.initBootstrapModal($modal);
	    },

	    initBootstrapModal: function($modal){
	        $modal.modal({
	            backdrop: 'static',
	            keyboard: false
	        });

	        if(!this.data.title){
	            var $modalStyle = $('<style>' +
	                '.vertical-align {'+
	                'display: flex;'+
	                'align-items: center;'+
	                '}'+
	                '.modal-dialog__full {'+
	                'width: 100%;'+
	                'height: 100%;'+
	                'margin: 0;'+
	                'padding: 0;'+
	                '}'+
	                '.modal-dialog__full .modal-content {'+
	                'height: auto;'+
	                'min-height: 100%;'+
	                'border-radius: 0;'+
	                '}' +
	                '</style>');
	            $('head').append($modalStyle);
	        }

	        if(this.data.clickToClose){
	            var $closeBtn = $modal.find('[data-dismiss=modal]');

	            if($closeBtn.length > 0){
	                this.closeBtn = $closeBtn[0];

	                this.closeBtn.setAttribute('style','display: none');

	                $modal.on('hidden.bs.modal', function (e) {
	                    this.triggerPreloadingComplete();
	                }.bind(this))
	            }else{
	                console.error('No Bootstrap modal close button is set in the HTML. Please add a button with the data-dismiss="modal" attribute to use clickToClose.');
	            }
	        }
	    },

	    triggerPreloadingComplete: function(){
	        if(this.data.debug){
	            console.info('Preloading complete');
	        }
	        if(this.data.disableVRModeUI){
	            this.el.setAttribute('vr-mode-ui','enabled','true');
	        }
	        this.el.emit('preloading-complete');
	    },

	    closeModal: function(){
	        switch(this.data.type){
	            case 'bootstrap':
	                $(this.data.target).modal('hide');
	                break;
	            default:
	                //do nothing
	                break;
	        }
	    }
	});

/***/ })
/******/ ]);
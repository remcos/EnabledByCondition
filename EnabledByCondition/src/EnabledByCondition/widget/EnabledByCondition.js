define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/dom-attr",


], function (declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoAttr) {
    "use strict";

    return declare("EnabledByCondition.widget.EnabledByCondition", [ _WidgetBase ], {


        // Internal variables.
        _handles: null,
        _contextObj: null,
        buttons: [],

        //Modeler variables.
        microflowName: "",
        nanoflow: "",
        buttonClassName: "",

        constructor: function () {
            this._handles = [];
        },

        enableButtons: function (enable) {
            if(enable) {
                for (var i=0; i<this.buttons.length; i++) {
                    dojoAttr.remove(this.buttons[i], "disabled");
                }
            } else {
                for (var i=0; i<this.buttons.length; i++) {
                    dojoAttr.set(this.buttons[i], "disabled", "true");
                }
            }
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");

            this.buttons = document.getElementsByClassName(this.buttonClassName);

            for (var i=0; i<this.buttons.length; i++) {
                dojoAttr.set(this.buttons[i], "disabled", "true");
            }
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj; 
            this._resetSubscriptions();

            this._updateRendering(callback);
        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");

            if(this.microflowName != '') {
                this._execMf(this.microflowName, this._contextObj.getGuid(), (result) => {
                    this.enableButtons(result);
                    this._executeCallback(callback, "_updateRendering");
                });
            } else if(typeof(this.nanoflow.nanoflow != 'undefined')) {
                this.execNf(this.nanoflowName, (result) => {
                    this.enableButtons(result);
                    this._executeCallback(callback, "_updateRendering");
                });
            }            
        },

        execNf: function (nf, cb) {
            logger.debug(this.id + ".execNf");
            if (nf) {
                mx.data.callNanoflow({
                    nanoflow: nf,
                    origin: this.mxform,
                    context: this.mxcontext,
                    callback: lang.hitch(this, function (result) {
                        if (cb && typeof cb === "function") {
                            cb(result);
                        }
                    }),
                    error: function(error) {
                        console.debug(error.description);
                    }
                }, this);
            }
        },

        // Shorthand for running a microflow
        _execMf: function (mf, guid, cb) {
            logger.debug(this.id + "._execMf");
            if (mf && guid) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [guid]
                    },
                    callback: lang.hitch(this, function (result) {
                        if (cb && typeof cb === "function") {
                            cb(result);
                        }
                    }),
                    error: function (error) {
                        console.debug(error.description);
                    }
                }, this);
            }
        },

        _resetSubscriptions: function () {
            var _objectHandle = null;
            // Release handles on previous object, if any.
            if (this._handles) {
                this._handles.forEach(lang.hitch(this, function (handle, i) {
                    this.unsubscribe(handle);
                }));
                this._handles = [];
            }

            // When a mendix object exists create subscribtions. 
            if (this._contextObj) {
                _objectHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: lang.hitch(this, function (guid) {
                        this._updateRendering();
                    })
                });
                this._handles = [_objectHandle];
            }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["EnabledByCondition/widget/EnabledByCondition"]);

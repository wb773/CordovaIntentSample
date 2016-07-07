/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('mainbutton').addEventListener('click', this.clickmain, false);
        document.getElementById('intentbutton').addEventListener('click', this.clickIntent, false);
        document.getElementById('checkbutton').addEventListener('click', this.clickCheck, false);
    
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    clickmain: function(params) {
        console.log('clickbutton');
        app.dl();
    },
    clickIntent: function(){
        window.resolveLocalFileSystemURL(cordova.file.cacheDirectory + "sample.txt", app.openText, function(){});
    },
    clickCheck: function(){
        app.checkPermission();
    },
    clearfile: function(){
        window.resolveLocalFileSystemURL(cordova.file.cacheDirectory + "sample.txt", app.gotFile, app.failFile);
    },
    gotFile: function(fileentry){
        fileentry.remove();
        console.log("remove file");
        app.dl();
    },
    failFile: function(){
        app.dl();
    },
    openText: function(){
        window.plugins.webintent.startActivity(
            {
                action: window.plugins.webintent.ACTION_VIEW,
                url: cordova.file.cacheDirectory + "sample.txt",
                type: 'text/plain'
            },
            function() {
                console.log("success open intent");
            },
            function() {
                alert('Failed to open URL via Android Intent.');
                console.log("Failed to open URL via Android Intent. URL: " + theFile.fullPath)
            }
        );
    },
    dl: function(){
        var fileTransfer = new FileTransfer();
        var uri = encodeURI("https://github.com/apache/cordova-android/blob/master/README.md");
        var fileURL = cordova.file.cacheDirectory + "sample.txt";
        console.log(fileURL);

        fileTransfer.download(
            uri,
            fileURL,
            function(entry) {
                console.log("download complete: " + entry.toURL());
                // var reader = new FileReader();

                // reader.onloadend = function(e) {
                //     console.log("Text is: "+this.result);
                //     document.querySelector("#textArea").innerHTML = this.result;
                // }

                // reader.readAsText(file);
                entry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function() {
                        console.log("Successful file read: " + this.result);
                        document.getElementById("textArea").innerHTML = this.result;
                    };

                    reader.readAsText(file);

                }, function(err){console.log(err);});
            },
            function(error) {
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("upload error code" + error.code);
            },
            false
        );
    },
    checkPermission: function(){
        cordova.plugins.diagnostic.getPermissionAuthorizationStatus(function(status){
            switch(status){
                    case cordova.plugins.diagnostic.runtimePermissionStatus.GRANTED:
                        console.log("Permission granted to use the READ_EXTERNAL_STORAGE");
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.NOT_REQUESTED:
                        console.log("Permission to use the READ_EXTERNAL_STORAGE has not been requested yet");
                        app.requestPermission();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED:
                        console.log("Permission denied to use the READ_EXTERNAL_STORAGE - ask again?");
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED_ALWAYS:
                        console.log("Permission permanently denied to use the READ_EXTERNAL_STORAGE - guess we won't be using it then!");
                        break;
                }
        }, function(error){
            console.error("The following error occurred: "+error);
        }, cordova.plugins.diagnostic.runtimePermission.READ_EXTERNAL_STORAGE);
    },
    requestPermission: function(){
        cordova.plugins.diagnostic.requestRuntimePermission(function(status){
            switch(status){
                case cordova.plugins.diagnostic.runtimePermissionStatus.GRANTED:
                    console.log("Permission granted to use the READ_EXTERNAL_STORAGE");
                    break;
                case cordova.plugins.diagnostic.runtimePermissionStatus.NOT_REQUESTED:
                    console.log("Permission to use the READ_EXTERNAL_STORAGE has not been requested yet");
                    break;
                case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED:
                    console.log("Permission denied to use the READ_EXTERNAL_STORAGE - ask again?");
                    break;
                case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED_ALWAYS:
                    console.log("Permission permanently denied to use the READ_EXTERNAL_STORAGE - guess we won't be using it then!");
                    break;
            }
        }, function(error){
            console.error("The following error occurred: "+error);
        }, cordova.plugins.diagnostic.runtimePermission.READ_EXTERNAL_STORAGE);
    }
};

app.initialize();
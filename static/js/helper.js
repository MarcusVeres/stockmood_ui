'use strict';

(function()
{

    var helper = {};

    helper.loadJson = function( source , callback )
    {
        var request = new XMLHttpRequest();

        // interpret the data as JSON no matter what the file extension is
        request.overrideMimeType( "application/json" );

        // pull the file from the local server
        request.open( "GET" , source , true );

        // listen for a success status
        request.onreadystatechange = function()
        {
            if( request.readyState === 4 && request.status == "200" )
            {
                // send the response data back as parsed JSON
                var raw = request.responseText;
                callback( JSON.parse( raw ) );

                // send the response data back as raw text
                // callback( request.responseText );
            }
        };

        // send the request to the endpoint 
        request.send( null );

    };

    helper.sayHello = function()
    {
        console.log( "hello" );
    }

    // bind the game object to the window
    window.helper = window.helper || helper;

})();


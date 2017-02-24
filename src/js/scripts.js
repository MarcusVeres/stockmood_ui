'use strict';

(function()
{
    // 
    console.log( "all systems go" );

    // parent object to hold all of our stuff
    var expo = {
    
        vue : null , 

        settings : {
            displayMode : "aligned" , 
            apiRoot : 'http://localhost:5000/' ,
        } ,

        loadContents : function()
        {
            // helper.loadJson( '/static/data/popularity.json' , function( dataObject )
            helper.loadJson( 'https://7skia38tri.execute-api.us-east-1.amazonaws.com/Dev/getpublicsentiment' , function( dataObject )
            {
                expo.vue.popularity = dataObject.publicSentiment;
                $('#overview-bar').progress({
                    percent: parseInt( dataObject.publicSentiment )
                });
            })

            // helper.loadJson( '/static/data/negative-tweets.json' , function( tweetsData )
            helper.loadJson( 'https://7skia38tri.execute-api.us-east-1.amazonaws.com/Dev/gettweets?limit=8&sortOrder=-1' , function( tweetsData )
            {
                expo.vue.negativeTweets = tweetsData;
            })

            // helper.loadJson( '/static/data/positive-tweets.json' , function( tweetsData )
            helper.loadJson( 'https://7skia38tri.execute-api.us-east-1.amazonaws.com/Dev/gettweets?limit=8&sortOrder=1' , function( tweetsData )
            {
                expo.vue.tweets = tweetsData;
            })

            helper.loadJson( 'https://7skia38tri.execute-api.us-east-1.amazonaws.com/Dev/getmostpopularwords' , function( dataObject )
            {
                expo.vue.trendingWords = dataObject;
            })

        },

        refreshData : function()
        {

        },

        // 
        
        setDisplayGrid : function() 
        {
            expo.vue.isGridView = true;
            expo.vue.isListView = false;
        },
        
        setDisplayList : function() 
        {
            expo.vue.isGridView = false;
            expo.vue.isListView = true;
        },

        // 

        bindButtons : function()
        {
            document.getElementById( 'set-view-list' ).addEventListener( 'click' , expo.setDisplayList );
            document.getElementById( 'set-view-grid' ).addEventListener( 'click' , expo.setDisplayGrid );
            // document.getElementById( 'refresh-data' ).addEventListener( 'click' , expo.refreshData );
            document.getElementById( 'refresh-data' ).addEventListener( 'click' , expo.loadContents );
        },

        init : function()
        {
            // populate vue 
            expo.vue = new Vue({

                el: '#app',

                data: {
                    // TODO : get some of these from the settings in the parent object
                    tweets : [] ,
                    negativeTweets : [] ,
                    activists: [] ,
                    trendingWords: [] ,
                    message : "" ,
                    displayMode : expo.settings.displayMode ,
                    currentTweet : {} ,
                    isNewTweetPaneVisible : false ,
                    newTweet : {} , 
                    isListView : true ,
                    isGridView : false ,
                    isEditMode : false ,
                },

                computed: {

                    filteredTweets: function () {
                        var self = this;
                        return self.tweets.filter(function (tweet) {
                            var searchRegex = new RegExp(self.message, 'i')
                            return searchRegex.test( tweet.Text ) || searchRegex.test( tweet.User.ScreenName )
                        })
                    },
                    
                    filteredNegativeTweets : function() {
                        var self = this;
                        return self.negativeTweets.filter(function (tweet) {
                            var searchRegex = new RegExp(self.message, 'i')
                            return searchRegex.test( tweet.Text ) || searchRegex.test( tweet.User.ScreenName )
                        })
                    },

                    someActivists : function() {
                        if( this.negativeTweets.length > 0 && this.tweets.length > 0 ){
                            return [
                                this.negativeTweets[0],
                                this.tweets[0],
                                this.negativeTweets[1],
                                this.tweets[1],
                            ]
                        } 
                        else {
                            return null;
                        }
                    },
                    
                    filteredTrendingWords : function() {
                        var self = this;
                        return self.trendingWords.filter(function (tweet) {
                            var searchRegex = new RegExp(self.message, 'i')
                            return searchRegex.test( tweet.Key ) 
                        })
                    },

                },

                methods: {

                    showNewTweetPane : function() {
                        expo.vue.isNewTweetPaneVisible = true;
                    },

                    hideNewTweetPane : function() {
                        expo.vue.isNewTweetPaneVisible = false;
                    },

                    clearSearch : function() {
                        expo.vue.message = "";
                    }

                },

            });

            expo.bindButtons();
            expo.loadContents();

            // set search message test 
            expo.vue.message = "";
        }

    };

    // start the show
    expo.init();

    // bind to the window
    window.expo = window.expo || expo;

    // we're done here
    return expo;

})();


/*
(function()
{

    var app = new Vue({
      el: '#app',
      data: {
        message: 'Hello Vue!'
      }
    })

})();
*/


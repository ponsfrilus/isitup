

exports.websites = function(checks){
    return {
        /**
         * "website": [{"url": "http://www.ebsi.te", "mode": "up"}],
         *   Note:
         *       - mode "up" send message if statusCode == 200
         *       - mode "down" send message if statusCode != 200
         **/
        "epfl": [{"url": "http://www.epfl.ch", check: checks.ensureUp}],
        "google": [{"url": "http://www.google.ch", check: checks.ensureUp}],
        "fake": [{"url": "http://www.thisisfake.ch", check: checks.ensureUp}]
    };

};

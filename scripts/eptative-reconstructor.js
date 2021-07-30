// имя мода с тире на конце
const mn = 'uni-';

const parts = []

//цвет эффекта дыма бура от
const screwSmokeColorFrom = Color.valueOf('e4e4e4');
//цвет эффекта дыма бура до
const screwSmokeColorTo = Color.valueOf('ffffff');
//размер кружков эффекта дыма
const screwSmokeSize = 2;
//размер(радиус) эффекта дыма
const screwEffectRange = 2;

// цвет эффекта сварки от
const welderFlameColorFrom = Color.valueOf('b6f7ff');
// цвет эффекта сварки до
const welderFlameColorTo = Color.valueOf('7acbd5');
// размер искр сварки
const welderSparkSize = 3.5;
// дальность разлёта искр сварки
const welderSparkRange = 25;


function createHand(id) {
    var hand = {
        //индекс руки в массиве parts
        id: id,
        len: 10,
        x: 0,
        y: 0,
        lastRotation: 0,
        rotation: 0,
        stage: 0,
        stopTime: 0,
        //progress: 0,
        children: [],
        parent: null,
        timer: new Interval(2),
        data: null,
        rotate(toAng, time) {
            if (this.lastRotation == toAng && !this.isAngleReached(toAng, 60)) {
                this.lastRotation = this.rotation;
            }
            Tmp.v2.trns(this.rotation, this.len);
            //const x = Tmp.v1.x;
            //const y = Tmp.v1.y;
            this.rotation = (this.rotation + (toAng - this.lastRotation) / time) % 360;
            Tmp.v1.trns(this.rotation, this.len);
            for (var i in this.children) {
                this.children[i].moveSelf(Tmp.v1.x - Tmp.v2.x, Tmp.v1.y - Tmp.v2.y);
                // print('x: '+(this.x + Tmp.v1.x)+' y: '+(this.y + Tmp.v1.y))
                // this.children[i].x = this.x + Tmp.v1.x;
                // this.children[i].y = this.y + Tmp.v1.y;
            }
        },
        moveSelf(dx, dy) {
            for (var i in this.children) {
                this.children[i].moveSelf(dx, dy);
            }
            this.x += dx;
            this.y += dy;
        },
        setChildren() {
            for (var i in this.children) {
                Tmp.v1.trns(this.rotation, this.len);
                this.children[i].x = Tmp.v1.x + this.x;
                this.children[i].y = Tmp.v1.y + this.y;
                this.children[i].setChildren()
            }
        },
        setStopTime(time) {
            this.stopTime = time;
            for (var i in this.children) {
                this.children[i].setStopTime(time);
            }
        },
        isAngleReached(ang, time) {
            //if(this.id==1)print('ang='+ang+' lastRotation='+this.lastRotation+' rot='+this.rotation+' time='+time)
            // if (parts[this.id].name === 'pentative-reconstructor-hand-wrist-right') {
            //     print('')
            //     print('traget angle = ' + ang);
            //     print('last rot = ' + this.lastRotation);
            //     print('time = ' + time);
            //     print('rot = ' + this.rotation);
            //     print('k = ' + (ang - this.lastRotation) / time * 1.5)
            //     print('real k = ' + Mathf.clamp(Math.abs((ang - this.lastRotation) / time * 1.5), 0.1, 4.5));
            //     print('value = ' + Mathf.equal(this.rotation, ang, Mathf.clamp(Math.abs((ang - this.lastRotation) / time * 1.5), 0.1, 4.5)))
            //     print('')
            // }
            return Mathf.equal(this.rotation, ang, (Mathf.clamp(Math.abs((ang - this.lastRotation) / time * 1.5), 0.1, 4.5)));
            // return Mathf.equal(this.rotation,ang,5);
        },
        draw(build) {
            parts[this.id].draw(this, build);
        }
    }
    return hand
}


function initHands() {
    var hands = []
    for (var i in parts) {
        var p = parts[i];
        var hand = createHand(p.id);
        hand.len = p.region.height / 2 / 4;
        hand.rotation = p.rotationIdle[0];
        hand.lastRotation = p.rotationIdle[0];

        // если рука является началом, задаем начальные координаты, которые потом меняться не будут
        if (p.base) {
            hand.x = p.baseX;
            hand.y = p.baseY;
        }

        hands[i] = hand;
    }

    // ищем родительскую руку для каждой руки, и добавляем родительской руке руку-ребенка
    for (var i in hands) {
        var h = hands[i];
        if (i == j) continue;
        // для каждой руки проходимся по всем рукам
        for (var j in hands) {
            // проходимся по детям этой руки
            for (var k in parts[j].children) {
                // если айди ребенка совпадает с айди руки h, то добавляем в руку hands[j] ребенка - руку h
                if (parts[j].children[k].id == h.id) {
                    hands[j].children.push(h);
                    h.parent = hands[j];
                }
            }
        }
    }

    for (var i in hands) {
        if (parts[i].base) {
            hands[i].setChildren();
        }
    }

    return hands;
}


/**
 * 
 * @param {string} name имя спрайта детали
 * @param {boolean} base является ли эта деталь началом руки
 * @param {number} baseX если является началом, координата начала Х
 * @param {number} baseY если является началом, координата начала Y
 * @param {Function} action(hand,building) действие, которе совершает рука при остановке
 * @param {Array} rotationWorking углы поворота детали при работе блока
 * @param {Array} rotWorkingTime время, за которое деталь поворачивается на нужный угол при работе
 * @param {Array} rotationIdle углы поворота детали при простое блока
 * @param {Array} stopTimes время, на которое останавливается рука после отработкт угла, работает только, если base=true
 * @param {Array} rotIdleTime  время, за которое деталь поворачивается на нужный угол при простое
 * @param {Array} children детали, идущие от этой детали
 * @returns объект-деталь
 */
function createPart(name, base, baseX, baseY, action, rotationWorking, rotWorkingTime, stopTimes, rotationIdle, rotIdleTime, children) {
    var part = {
        // индекс в массиве parts
        id: 0,
        //спрайт
        region: null,
        name: name,
        action: action,
        // повороты руки во время работы, выполняются последовательно
        rotationWorking: rotationWorking,
        rotWorkingTime: rotWorkingTime,
        stopTimes: stopTimes,
        // повороты руки во время простоя, выполняются последовательно
        rotationIdle: rotationIdle,
        rotIdleTime: rotIdleTime,
        // руки, идущие от этой руки 
        children: children,
        //является ли эта рука началом всей руки
        base: base,
        baseX: baseX,
        baseY: baseY,
        draw(hand, build) {
            Draw.rect(this.region, build.x + hand.x, build.y + hand.y, hand.rotation - 90);
        }
    }
    // part.id = parts.length;
    parts.push(part);
    return part;
}

function getPartByName(name) {
    for (var i in parts) {
        if (parts[i].name === name) {
            return parts[i];
        }
    }
    print('пиздец!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    return null
}


const welderFlame = new Effect(18, cons(e => {
    Draw.color(welderFlameColorFrom,welderFlameColorTo,e.fin());
    Fill.circle(e.x + Mathf.randomSeedRange(e.id, welderSparkRange) * e.fin(), e.y + Mathf.randomSeedRange(e.id + 3, welderSparkRange) * e.fin() - e.rotation * e.fin(), welderSparkSize * e.fout());
}));

const welding = (h, build) => {
    Tmp.v1.trns(h.rotation, h.len);
    welderFlame.at(build.x + h.x + Tmp.v1.x, build.y + h.y + Tmp.v1.y, Mathf.random(4, 11));
};

const screwSmoke = new Effect(20, cons(e => {
    Draw.color(screwSmokeColorFrom, screwSmokeColorTo, e.fin());
    Fill.circle(e.x, e.y, screwSmokeSize*e.fout());
}));

const screwing = (h,build) => {
    if(h.timer.get(5)){
        Tmp.v1.trns(h.rotation, h.len);
        screwSmoke.at(build.x + h.x + Tmp.v1.x+Mathf.range(screwEffectRange), build.y + h.y + Tmp.v1.y+Mathf.range(screwEffectRange));
    }
}
createPart('hand-base-long', true, -50, -50, null,
    [135, 75, 85], // углы поворота при работе блока
    [60, 70, 80], // время, за которое рука на этот угол поворачивает(примерное)
    [80, 70, 60], // время остановки после отработки угла
    [65], // углы при неработе блока
    [360], // время, за которое рука на этот угол поворачивает(примерное)
    [
        createPart('hand-long', false, 0, 0, null,
            [55, 5, 65], // углы поворота при работе блока
            [60, 70, 80], // время, за которое рука на этот угол поворачивает(примерное)
            [80, 70, 60], // время остановки после отработки угла
            [90], // углы при неработе блока
            [360], // время, за которое рука на этот угол поворачивает(примерное)
            [
                createPart('hand-screw-driver', false, 0, 0, screwing,
                    [0, -70, 25], // углы поворота при работе блока
                    [60, 70, 80], // время, за которое рука на этот угол поворачивает(примерное)
                    [80, 70, 60], // время остановки после отработки угла
                    [155], // углы при неработе блока
                    [360], // время, за которое рука на этот угол поворачивает(примерное)
                    [])
            ])
    ]
)
createPart('hand-base-long', true, 50, -50, null,
    [55, 65, 140], // углы поворота при работе блока
    [80, 70, 60], // время, за которое рука на этот угол поворачивает(примерное)
    [60, 70, 80], // время остановки после отработки угла
    [115], // углы при неработе блока
    [360], // время, за которое рука на этот угол поворачивает(примерное)
    [
        createPart('hand-long', false, 0, 0, null,
            [120, 200, 140], // углы поворота при работе блока
            [80, 70, 60], // время, за которое рука на этот угол поворачивает(примерное)
            [60, 70, 80], // время остановки после отработки угла
            [90], // углы при неработе блока
            [360], // время, за которое рука на этот угол поворачивает(примерное)
            [
                createPart('hand-laser-press', false, 0, 0, null,
                    [215, 180, 170], // углы поворота при работе блока
                    [80, 70, 60], // время, за которое рука на этот угол поворачивает(примерное)
                    [60, 70, 80], // время остановки после отработки угла
                    [25], // углы при неработе блока
                    [360], // время, за которое рука на этот угол поворачивает(примерное)
                    [])
            ])
    ]
)
createPart('hand-base-long-reverse', true, -50, 50, null,
    [50, -135, -35], // углы поворота при работе блока
    [80, 100, 80], // время, за которое рука на этот угол поворачивает(примерное)
    [60, 60, 60], // время остановки после отработки угла
    [340], // углы при неработе блока
    [360], // время, за которое рука на этот угол поворачивает(примерное)
    [
        createPart('hand-long-reverse', false, 0, 0, null,
            [330, 350, 285], // углы поворота при работе блока
            [80, 100, 80], // время, за которое рука на этот угол поворачивает(примерное)
            [60, 60, 60], // время остановки после отработки угла
            [270], // углы при неработе блока                                                 ПЕРВЫЙ WELDER                                  
            [360], // время, за которое рука на этот угол поворачивает(примерное)
            [
                createPart('hand-upgraded-welder', false, 0, 0, welding,
                    [265, 270, 235], // углы поворота при работе блока
                    [80, 100, 80], // время, за которое рука на этот угол поворачивает(примерное)
                    [60, 60, 60], // время остановки после отработки угла
                    [270], // углы при неработе блока
                    [360], // время, за которое рука на этот угол поворачивает(примерное)
                    [])
            ])
    ]
)
createPart('hand-base-long-reverse', true, 50, 50, null,
    [255, 145, 300], // углы поворота при работе блока
    [100, 80, 90], // время, за которое рука на этот угол поворачивает(примерное)
    [80, 80, 80], // время остановки после отработки угла
    [210], // углы при неработе блока
    [360], // время, за которое рука на этот угол поворачивает(примерное)
    [
        createPart('hand-long-reverse', false, 0, 0, null,
            [215, 235, 180], // углы поворота при работе блока
            [100, 80, 90], // время, за которое рука на этот угол поворачивает(примерное)
            [80, 80, 80], // время остановки после отработки угла
            [270], // углы при неработе блока                                                 ВТОРОЙ WELDER
            [360], // время, за которое рука на этот угол поворачивает(примерное)
            [
                createPart('hand-upgraded-welder', false, 0, 0, welding,
                    [275, 345, 210], // углы поворота при работе блока
                    [100, 80, 90], // время, за которое рука на этот угол поворачивает(примерное)
                    [80, 80, 80], // время остановки после отработки угла
                    [270], // углы при неработе блока
                    [360], // время, за которое рука на этот угол поворачивает(примерное)
                    [])
            ])
    ]
)

const eptativeReconstructor = extend(Reconstructor, 'eptative-reconstructor', {
    init() {
        this.super$init();
        for (var i in parts) {
            parts[i].region = Core.atlas.find(mn + parts[i].name);
            parts[i].id = i;
        }
        const press = getPartByName('hand-laser-press');
        press.regions = []
        for (var i = 1; i < 26; i++) {
            press.regions.push(Core.atlas.find(mn + 'laser-press' + i));
        }
        press.draw = function (hand, build) {
            if (hand.data == null) hand.data = 0
            if (hand.stopTime > 0) hand.data = (hand.data + 1) % 25;
            Draw.rect(this.regions[hand.data], build.x + hand.x, build.y + hand.y, hand.rotation - 90);
        }

        
        this.super$init();
        for (var i in parts) {
            parts[i].region = Core.atlas.find(mn + parts[i].name);
            parts[i].id = i;
        }
        const screw = getPartByName('hand-screw-driver');
        screw.regions = []
        for (var i = 1; i < 19; i++) {
            screw.regions.push(Core.atlas.find(mn + 'screw-driver' + i));
        }
        screw.draw = function (hand, build) {
            if (hand.data == null) hand.data = 0
            if (hand.stopTime > 0) hand.data = (hand.data + 1) % 18;
            Draw.rect(this.regions[hand.data], build.x + hand.x, build.y + hand.y, hand.rotation - 90);
        }
    }
});
eptativeReconstructor.buildType = prov(() => extend(Reconstructor.ReconstructorBuild, eptativeReconstructor, {
    hands: null,
    working: false,
    updateTile() {
        this.super$updateTile();

        if (this.hands == null) {
            this.hands = initHands();
        }

        if (this.working != this.efficiency() > 0.01) {
            for (var i in this.hands) {
                this.hands[i].lastRotation = this.hands[i].rotation;
            }
        }

        if (this.efficiency() > 0.01 && this.constructing() && this.hasArrived()) {
            for (var i in this.hands) {

                var h = this.hands[i];
                var p = parts[h.id];
                h.stage %= p.rotationWorking.length;

                if (h.stopTime > 0) {
                    h.stopTime -= Time.delta;
                    if (p.action != null) {
                        p.action(h, this);
                    }
                    continue;
                }
                h.stopTime = 0;
                // var from = p.rotationWorking[h.stage];
                // var to = p.rotationWorking[(h.stage + 1) % p.rotationWorking.length]

                // print('rot: '+h.rotation+' rotW[h.stage]: ' + p.rotationWorking[h.stage]+' stge: '+h.stage+' progress: '+h.progress)

                // print(h.rotation+' '+ to)
                if (h.isAngleReached(p.rotationWorking[h.stage], p.rotWorkingTime[h.stage] / this.delta())) {
                    h.lastRotation = p.rotationWorking[h.stage];
                    if (p.base) {
                        h.setStopTime(p.stopTimes[h.stage]);
                    }
                    h.stage = (h.stage + 1) % p.rotationWorking.length;
                } else {
                    h.rotate(p.rotationWorking[h.stage], p.rotWorkingTime[h.stage] / this.delta());
                }

            }
        } else {
            for (var i in this.hands) {

                var h = this.hands[i];
                var p = parts[h.id];
                h.stage %= p.rotationIdle.length;

                if (h.stopTime > 0) {
                    h.stopTime -= Time.delta;
                    // if (p.action != null) {
                    //     p.action(h, this);
                    // }
                    continue;
                }
                h.stopTime = 0;
                // var from = p.rotationIdle[h.stage];
                // var to = p.rotationIdle[(h.stage + 1) % p.rotationIdle.length]

                // print('ang='+p.rotationIdle[h.stage]+' lastRotation='+h.lastRotation+' rot='+h.rotation+' time='+p.rotIdleTime[h.stage]/this.delta())
                //print(h.rotation+' '+ to)
                if (h.isAngleReached(p.rotationIdle[h.stage], p.rotIdleTime[h.stage] / this.delta())) {
                    h.lastRotation = p.rotationIdle[h.stage];
                    h.stage = (h.stage + 1) % p.rotationIdle.length;
                } else {
                    h.rotate(p.rotationIdle[h.stage], p.rotIdleTime[h.stage] / this.delta());
                }

            }
        }

        this.working = this.efficiency() > 0.01 && this.constructing() && this.hasArrived();
    },
    draw() {
        this.super$draw();

        for (var i in this.hands) {
            Draw.rect(parts[this.hands[i].id].region, this.x + this.hands[i].x, this.y + this.hands[i].y, this.hands[i].rotation - 90);
            //Fill.circle(this.x + this.hands[i].x, this.y + this.hands[i].y, 5)
            this.hands[i].draw(this);
        }

    }
}));
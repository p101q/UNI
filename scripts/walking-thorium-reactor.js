var tr = new Vec2();
const WalkThor = extendContent(UnitType, "walking-thorium-reactor", {});
WalkThor.constructor = prov(() => extend(LegsUnit, {
	killed() {
		this.super$killed();
		Sounds.explosionbig.at(this);
		Effect.shake(6, 16, this.x, this.y);
		Fx.nuclearShockwave.at(this.x, this.y);

		for (var i = 0; i < 6; i++) {
			Time.run(Mathf.random(40), run(() => Fx.nuclearcloud.at(this.x, this.y)));
		}

		Damage.damage(this.x, this.y,/*радиус взрыва: */ 150,/*урон: */ 1000);

		for (var i = 0; i < 20; i++) {
			Time.run(Mathf.random(50), run(() => {
				tr.rnd(Mathf.random(40));
				Fx.explosion.at(tr.x + this.x, tr.y + this.y);
			}));
		}

		for (var i = 0; i < 70; i++) {
			Time.run(Mathf.random(80), run(() => {
				tr.rnd(Mathf.random(120));
				Fx.nuclearsmoke.at(tr.x + this.x, tr.y + this.y);
			}));
		}
	},
	classId: ()=>WalkThor.classId
}));

const register = unit => {
    // Register unit's name
    EntityMapping.nameMap.put(unit.name, unit.constructor);

    // Find available class id and register it
    unit.classId = -1;
    for (var i in EntityMapping.idMap) {
        if (!EntityMapping.idMap[i]) {
            EntityMapping.idMap[i] = unit.constructor;
            unit.classId = i;
            return;
        }
    }

    // Incase you used up all 256 class ids; use the same code for ~250 units you idiot.
    throw new IllegalArgumentException(unit.name + " has no class ID");
};

register(WalkThor)
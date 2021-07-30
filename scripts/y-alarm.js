const bulletHitEffect = extend(MultiEffect,{
	effects: [
	extend(ParticleEffect, {
		colorFrom: Color.valueOf("f19583"),
		colorTo: Color.valueOf("fff3d6"),
		particles: 15,
		cone: 360,
		length: -90,
		baseLength: 90,
		sizeFrom: 0,
		sizeTo: 7,
		lifetime: 30,
	}),
	extend(WaveEffect, {
		colorFrom: Color.valueOf("f19583"),
		colorTo: Color.valueOf("fff3d6"),
		lifetime: 30,
		sizeFrom: 110,
		sizeTo: 0,
		strokeFrom: 0,
		strokeTo: 6,
		})
	]
});

const bulletShootEffect = extend(MultiEffect,{
	effects: [
	extend(ParticleEffect, {
		colorFrom: Color.valueOf("f19583"),
		colorTo: Color.valueOf("fff3d6"),
		particles: 30,
		cone: 10,
		length: 200,
		baseLength: 0,
		sizeFrom: 7,
		sizeTo: 0,
		lifetime: 30,
	}),
	extend(WaveEffect, {
		colorFrom: Color.valueOf("fff3d6"),
		colorTo: Color.valueOf("f19583"),
		lifetime: 40,
		sizeFrom: 0,
		sizeTo: 50,
		strokeFrom: 3,
		strokeTo: 0,
		})
	]
});

const fragBulletHitEffect = extend(ParticleEffect, {
	colorFrom: Color.valueOf("fff3d6"),
	colorTo: Color.valueOf("f19583"),
	particles: 12,
	cone: 7,
	length: 100,
	baseLength: 0,
	sizeFrom: 7,
	sizeTo: 0,
	lifetime: 20,
});



const mn = "uni-"

// const animations = new Seq();
const vec = new Vec2();

const createAnimation = function (region, start, end, time, underTurret) {
	const anim = {
		region: mn + region,
		start: start,
		end: end,
		under: underTurret,
		time: time,
		curTime: 0,
		x: 0,
		y: 0,
		progress: 0,
		condition(b) {
			var val = (b.block instanceof ItemTurret ? b.hasAmmo() : true) && (b.block.reloadTime-b.reload) <= this.time;
			// var val = /*(b.block instanceof ItemTurret ? b.hasAmmo() : true) &&*/ (b.block.hasPower ? (b.power.status > 0.01) : true) && (b.target != null || b.logicControlled() || b.isControlled());
			// print(val + " " + b.id);
			return val;
		},
		updatePosition(reverse) {
			this.curTime = Mathf.clamp(this.curTime + (reverse ? -Time.delta : Time.delta), 0, this.time);
			this.progress = this.curTime / this.time;
			this.x = Mathf.lerp(this.start.x, this.end.x, this.progress);
			this.y = Mathf.lerp(this.start.y, this.end.y, this.progress);
		}
	};
	return anim;
}

// const initAnimations = () => new Seq(animations);

const initAnimations = function () {
	const animations = new Seq();



	animations.add(createAnimation(
		"y-alarm-up-left", //имя спрайта
		new Vec2(0, 0),     //точка начала (x,y)
		new Vec2(-3, 0),  //точка конца (x,y)
		20,                 //время движения
		false               //false - рисуется под турелью, true - над турелью
	)
	);

	animations.add(createAnimation(
		"y-alarm-up-right", //имя спрайта
		new Vec2(0, 0),     //точка начала (x,y)
		new Vec2(3, 0),   //точка конца (x,y)
		20,                 //время движения
		false              //false - рисуется под турелью, true - над турелью
	)
	);

	animations.add(createAnimation(
		"y-alarm-down-left", //имя спрайта
		new Vec2(0, 0),     //точка начала (x,y)
		new Vec2(-3, 0),  //точка конца (x,y)
		20,                 //время движения
		false              //false - рисуется под турелью, true - над турелью
	)
	);

	animations.add(createAnimation(
		"y-alarm-down-right", //имя спрайта
		new Vec2(0, 0),     //точка начала (x,y)
		new Vec2(3, 0),   //точка конца (x,y)
		20,                 //время движения
		false              //false - рисуется под турелью, true - над турелью
	)
	);



	return animations;
}



const fragBullets = 24;
const length = 140;
const lengthRand = 0;
const fragVelocityMin = 1, fragVelocityMax = 1, fragLifeMin = 1, fragLifeMax = 1;

const fragBullet = extend(BasicBulletType, {
	despawned(b) {
		this.hitEffect.at(b.x, b.y, b.rotation());
	},
	speed: 3.1,
	damage: 150,
	lifetime: 53,
	width: 1,
	height: 1,
	pierce: true,
	pierceCap: 5,
	knockback: 50,
	keepVelocity: false,
	frontColor: Color.valueOf("fff3d6"),
	backColor: Color.valueOf("f19583"),
	shrinkX: -15,
	shrinkY: -25,
	hitEffect: fragBulletHitEffect,
});

const bullet = extend(ArtilleryBulletType, {
	despawned(b) {
		this.super$despawned(b);
		this.hitEffect.at(b.x, b.y, b.rotation());

		for (var i = 0; i < fragBullets; i++) {
			var ang = 360 / fragBullets * i;
			var len = length + Mathf.range(lengthRand);
			fragBullet.create(b,
				b.x + Angles.trnsx(ang, len),
				b.y + Angles.trnsy(ang, len),
				ang - 180,
				Mathf.random(fragVelocityMin, fragVelocityMax),
				Mathf.random(fragLifeMin, fragLifeMax)
			);
		}

	}
});
bullet.splashDamageRadius = 80;
bullet.splashDamage = 435;
bullet.speed = 4.5;
bullet.lifetime = 70;
bullet.width = 25;
bullet.height = 40;
bullet.knockback = -75;
bullet.frontColor = Color.valueOf("fff3d6");
bullet.backColor = Color.valueOf("f19583");
bullet.shootEffect = bulletShootEffect;
bullet.hitEffect = bulletHitEffect;
bullet.hitShake = 8;
bullet.status = StatusEffects.unmoving;
bullet.statusDuration = 60;

const animTurret = extend(ItemTurret, "y-alarm", {
	init() {
		this.ammoTypes.put(Items.phaseFabric, bullet);
		this.consumes.powerCond(25, b => b.isActive());
		this.super$init();
	},
	icons() {
		return [
			this.baseRegion,
			this.region,
			Core.atlas.find(mn+"y-alarm-up-left"),
			Core.atlas.find(mn+"y-alarm-up-right"),
			Core.atlas.find(mn+"y-alarm-down-left"),
			Core.atlas.find(mn+"y-alarm-down-right"),
		]
	}
});
animTurret.outlineIcon = false;

animTurret.buildType = prov(() => extend(ItemTurret.ItemTurretBuild, animTurret, {

	animations: null,

	updateTile() {
		this.super$updateTile();

		if (this.animations === null) this.animations = initAnimations();

		this.animations.each(a => {
			if (a.condition(this)) {
				a.updatePosition(false);
			} else {
				a.updatePosition(true);
			}
		})

	},
	draw() {

		Draw.rect(this.block.baseRegion, this.x, this.y);
		Draw.color();

		Draw.z(Layer.turret);

		this.block.tr2.trns(this.rotation, -this.recoil);

		Drawf.shadow(this.block.region, this.x + this.block.tr2.x - this.block.elevation, this.y + this.block.tr2.y - this.block.elevation, this.rotation - 90);

		this.animations.each(a => {
			if (!a.under) return;
			vec.set(a.x, a.y).rotate(this.rotation - 90);
			Draw.rect(a.region, this.x + this.block.tr2.x + vec.x, this.y + this.block.tr2.y + vec.y, this.rotation - 90);
		});

		Draw.rect(this.block.region, this.x + this.block.tr2.x, this.y + this.block.tr2.y, this.rotation - 90);

		Draw.color(this.block.heatColor, this.heat);
		Draw.blend(Blending.additive);
		Draw.rect(this.block.heatRegion, this.x + this.block.tr2.x, this.y + this.block.tr2.y, this.rotation - 90);
		Draw.blend();
		Draw.color();

		this.animations.each(a => {
			if (a.under) return;
			vec.set(a.x, a.y).rotate(this.rotation - 90);
			Draw.rect(a.region, this.x + this.block.tr2.x + vec.x, this.y + this.block.tr2.y + vec.y, this.rotation - 90);
		});

	}
}));
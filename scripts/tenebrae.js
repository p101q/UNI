const tenebraeTrail = new Effect(9,e=>{
    if(Core.settings.getBool("bloom")){
        Draw.rect("uni-tenebrae-engine",e.x,e.y,e.rotation);
    } else {
        Draw.blend(Blending.additive);
        Draw.color(Color.valueOf("#d19719"),0.5);
        Draw.rect("uni-tanabrae-engine",e.x,e.y,e.rotation);
        Draw.blend();
    }
    
});

const HorizonBullet = extend(BasicBulletType, {
	despawned(b) {
		UnitTypes.horizon.spawn(b.team, b.x, b.y)
	},
	hit(b) {
		this.hitEffect.at(b.x, b.y, b.rotation());
		Damage.damage(b.team, b.x, b.y, this.splashDamageRadius, this.splashDamage * b.damageMultiplier());
		this.despawned(b)
	}
});

HorizonBullet.hitSound = Sounds.click;
HorizonBullet.hitEffect = Fx.flakExplosion;
HorizonBullet.knockback = 10;
HorizonBullet.lifetime = 60;
HorizonBullet.width = 20;
HorizonBullet.height = 20;
HorizonBullet.sprite = "uni-horizon-bullet";
HorizonBullet.speed = 6;
HorizonBullet.splashDamageRadius = 10;
HorizonBullet.collidesTiles = false;
HorizonBullet.splashDamage = 20;
HorizonBullet.backColor = Color.valueOf("dfdfdf");
HorizonBullet.frontColor = Color.valueOf("dfdfdf");
HorizonBullet.shrinkY = 0;
HorizonBullet.smokeEffect = Fx.shootBigSmoke2;
HorizonBullet.hitShake = 3;

const HorizonThrowerWeapon = extend(Weapon, {
	load() {
		this.super$load()
		
		this.outlineRegion = Core.atlas.find("uni-non-weapon");
		this.heatRegion = Core.atlas.find("error");
		this.region = Core.atlas.find("uni-non-weapon");
	}
});
HorizonThrowerWeapon.reload = 300;
HorizonThrowerWeapon.shootSound = Sounds.artillery;
HorizonThrowerWeapon.rotate = false;
HorizonThrowerWeapon.mirror = false;
HorizonThrowerWeapon.ejectEffect = Fx.none;
HorizonThrowerWeapon.bullet = HorizonBullet;
HorizonThrowerWeapon.shake = 6;
HorizonThrowerWeapon.shots = 1;
HorizonThrowerWeapon.x = 0;
HorizonThrowerWeapon.y = 0;
HorizonThrowerWeapon.shootY = 6;
HorizonThrowerWeapon.inaccuracy = 3;



const FlareBullet = extend(BasicBulletType, {
	despawned(b) {
		UnitTypes.flare.spawn(b.team, b.x, b.y)
	},
	hit(b) {
		this.hitEffect.at(b.x, b.y, b.rotation());
		Damage.damage(b.team, b.x, b.y, this.splashDamageRadius, this.splashDamage * b.damageMultiplier());
		this.despawned(b)
	}
});

FlareBullet.hitSound = Sounds.click;
FlareBullet.hitEffect = Fx.flakExplosion;
FlareBullet.knockback = 10;
FlareBullet.lifetime = 55;
FlareBullet.width = 12;
FlareBullet.height = 12;
FlareBullet.sprite = "uni-flare-bullet";
FlareBullet.speed = 6;
FlareBullet.splashDamageRadius = 10;
FlareBullet.collidesTiles = false;
FlareBullet.splashDamage = 20;
FlareBullet.backColor = Color.valueOf("dfdfdf");
FlareBullet.frontColor = Color.valueOf("dfdfdf");
FlareBullet.shrinkY = 0;
FlareBullet.smokeEffect = Fx.shootBigSmoke2;
FlareBullet.hitShake = 2;


const Tenebrae = extendContent(UnitType, "tenebrae", {
	update(u) {
        this.super$update(u);
        tenebraeTrail.at(u.x,u.y,u.rotation-90);
    }
});
Tenebrae.constructor = prov(() => extend(UnitEntity, {}));

const FlaresThrowerWeapon = extend(Weapon, {
	load() {
		this.super$load()
		
		this.outlineRegion = Core.atlas.find("uni-non-weapon");
		this.heatRegion = Core.atlas.find("error");
		this.region = Core.atlas.find("uni-non-weapon");
	}
});

FlaresThrowerWeapon.reload = 300;
FlaresThrowerWeapon.shootSound = Sounds.artillery;
FlaresThrowerWeapon.rotate = false;
FlaresThrowerWeapon.mirror = false;
FlaresThrowerWeapon.ejectEffect = Fx.none;
FlaresThrowerWeapon.bullet = FlareBullet;
FlaresThrowerWeapon.shake = 6;
FlaresThrowerWeapon.shots = 4;
FlaresThrowerWeapon.x = 0;
FlaresThrowerWeapon.y = 0;
FlaresThrowerWeapon.shootY = 6;
FlaresThrowerWeapon.inaccuracy = 3;

try {
	Events.on(ClientLoadEvent, cons(e => {
		try {
			FlaresThrowerWeapon.load();
			HorizonThrowerWeapon.load();
			Tenebrae.weapons.add(FlaresThrowerWeapon);
			Tenebrae.weapons.add(HorizonThrowerWeapon);
		} catch (e) {
			print(e)
			print(e.stack)
		}
	}))
} catch (e) {
	print(e)
	print(e.stack)
}
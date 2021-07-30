// имя мода с тире на конце
const mn = 'uni-';
const radFull = 3.1415927 * 2;

// начальный угол поворота правой жвалы,
const baseAngRight = -15;
// для левой
const baseAngLeft = -baseAngRight;
// амплитуда колебаний жвал вокруг начального угла
const angMag = 30;
// скорость движения жвал
const rotateSpeed = 0.05;
// координаты относительно центра юнита для Правой жвалы
const offsetX = 15;
const offsetY = 20;
// если true, то жвалы рисуются под юнитом
const underUnit = true;

const FragCannonBullet = extend(ArtilleryBulletType, {
});

FragCannonBullet.hitEffect = Fx.sapExplosion;
FragCannonBullet.knockback = 15;
FragCannonBullet.lifetime = 50;
FragCannonBullet.speed = 1;
FragCannonBullet.width = 25;
FragCannonBullet.height = 25;
FragCannonBullet.collidesTiles = false;
FragCannonBullet.splashDamageRadius = 85;
FragCannonBullet.splashDamage = 120;
FragCannonBullet.backColor = Color.valueOf("6d56bf");
FragCannonBullet.frontColor = Color.valueOf("bf92f9");
FragCannonBullet.lightningColor = Color.valueOf("665c9f");
FragCannonBullet.lightning = 3;
FragCannonBullet.lightningLength = 7;
FragCannonBullet.lightningDamage = 75;
FragCannonBullet.smokeEffect = Fx.shootBigSmoke2;
FragCannonBullet.hitShake = 10;

FragCannonBullet.status = StatusEffects.sapped;
FragCannonBullet.statusDuration = 600;


const Crawlerb = extend(ArtilleryBulletType, {
	despawned(b) {
		UnitTypes.crawler.spawn(b.team, b.x, b.y)
	},
	hit(b) {
		this.hitEffect.at(b.x, b.y, b.rotation());
		Damage.damage(b.team, b.x, b.y, this.splashDamageRadius, this.splashDamage * b.damageMultiplier());
		this.despawned(b)
	}
});

Crawlerb.hitSound = Sounds.sap;
Crawlerb.hitEffect = Fx.sapExplosion;
Crawlerb.knockback = 0;
Crawlerb.lifetime = 25;
Crawlerb.width = 16;
Crawlerb.height = 16;
Crawlerb.sprite = "uni-crawler-bullet";
Crawlerb.speed = 1;
Crawlerb.splashDamageRadius = 70;
Crawlerb.collidesTiles = false;
Crawlerb.splashDamage = 105;
Crawlerb.backColor = Color.valueOf("b8b8b8");
Crawlerb.frontColor = Color.valueOf("b8b8b8");
Crawlerb.lightning = 2;
Crawlerb.shrinkY = 0;
Crawlerb.lightningLength = 16;
Crawlerb.smokeEffect = Fx.shootBigSmoke2;
Crawlerb.hitShake = 5;
Crawlerb.shootEffect = Fx.shockwave;
Crawlerb.status = StatusEffects.sapped;
Crawlerb.statusDuration = 150;


const CrawlersBullet = extend(ArtilleryBulletType, {
	despawned(b) {
		for (var i = 0; i < 6; i++) {
			Crawlerb.create(b.owner, b.x, b.y, Mathf.random(360))
		};
		FragCannonBullet.create(b.owner, b.x, b.y, Mathf.random(360));
		FragCannonBullet.lifetime = 10;
		FragCannonBullet.create(b.owner, b.x, b.y, Mathf.random(360));
		FragCannonBullet.lifetime = 13;
		FragCannonBullet.create(b.owner, b.x, b.y, Mathf.random(360));
		FragCannonBullet.lifetime = 16;
		FragCannonBullet.create(b.owner, b.x, b.y, Mathf.random(360));
		FragCannonBullet.lifetime = 19;
		FragCannonBullet.create(b.owner, b.x, b.y, Mathf.random(360));
		FragCannonBullet.lifetime = 22;
		FragCannonBullet.create(b.owner, b.x, b.y, Mathf.random(360));
		FragCannonBullet.lifetime = 25;
		FragCannonBullet.create(b.owner, b.x, b.y, Mathf.random(360));
		FragCannonBullet.lifetime = 28;
		FragCannonBullet.create(b.owner, b.x, b.y, Mathf.random(360));
		FragCannonBullet.lifetime = 31;
		FragCannonBullet.create(b.owner, b.x, b.y, Mathf.random(360));
		FragCannonBullet.lifetime = 34;
		FragCannonBullet.create(b.owner, b.x, b.y, Mathf.random(360));
		FragCannonBullet.lifetime = 37;
		FragCannonBullet.create(b.owner, b.x, b.y, Mathf.random(360));
		FragCannonBullet.lifetime = 40;
		FragCannonBullet.create(b.owner, b.x, b.y, Mathf.random(360));
		FragCannonBullet.lifetime = 43;
		FragCannonBullet.create(b.owner, b.x, b.y, Mathf.random(360));
		FragCannonBullet.lifetime = 46;
	},
	hit(b) {
		this.hitEffect.at(b.x, b.y, b.rotation());
		Damage.damage(b.team, b.x, b.y, this.splashDamageRadius, this.splashDamage * b.damageMultiplier());
		this.despawned(b)
	}
});

CrawlersBullet.hitSound = Sounds.sap;
CrawlersBullet.knockback = 25;
CrawlersBullet.lifetime = 105;
CrawlersBullet.width = 32;
CrawlersBullet.height = 32;
CrawlersBullet.speed = 3;
CrawlersBullet.sprite = "uni-crawlers-container-bullet";
CrawlersBullet.damage = 300;
CrawlersBullet.pierce = true;
CrawlersBullet.pierceCap = 12;
CrawlersBullet.splashDamageRadius = 120;
CrawlersBullet.splashDamage = 520;
CrawlersBullet.backColor = Color.valueOf("b8b8b8");
CrawlersBullet.frontColor = Color.valueOf("b8b8b8");
CrawlersBullet.collidesTiles = false;
CrawlersBullet.lightning = 12;
CrawlersBullet.shrinkY = 0;
CrawlersBullet.lightningLength = 15;
CrawlersBullet.lightningDamage = 120;
CrawlersBullet.smokeEffect = Fx.shootBigSmoke2;
CrawlersBullet.shootEffect = Fx.shockwave;
CrawlersBullet.status = StatusEffects.sapped;
CrawlersBullet.statusDuration = 600;
CrawlersBullet.recoil = 3;


const Kagrax = extendContent(UnitType, "kagrax", {
	mandibleLeftRegion: null,
	mandibleRightRegion: null,
	load() {
		this.super$load();
		this.mandibleLeftRegion = Core.atlas.find(mn + "mandible-left");
		this.mandibleRightRegion = Core.atlas.find(mn + "mandible-right");
	},
	draw(u) {
		this.super$draw(u);

		Draw.z(underUnit ? this.groundLayer + Mathf.clamp(this.hitSize / 4000, 0, 0.001) - 0.001 : this.groundLayer + Mathf.clamp(this.hitSize / 4000, 0, 0.01) + 0.01)

		const deltaAng = Mathf.sin((Time.time * rotateSpeed + u.id * 777) % (10 * radFull), 1, angMag);
		
		// var expression = (Time.time * rotateSpeed + u.id * 777) % (10 * radFull);

		// print(u.id + " Time.time=" + Time.time)
		// print(u.id + " rotateSpeed=" + rotateSpeed)
		// print(u.id + "  u.id * 777=" + u.id * 777)
		// print(u.id + " angMag=" + angMag)
		// print(u.id + " expression=" + expression)
		// print(u.id + " sin = " + Mathf.sin(expression, 1, 30))
		// print(u.id + " deltaAng=" + deltaAng)
		// print("")


		Tmp.v1.set(offsetX, offsetY);
		Tmp.v1.rotate(u.rotation - 90);

		Draw.rect(this.mandibleRightRegion, u.x + Tmp.v1.x, u.y + Tmp.v1.y, u.rotation - 90 + baseAngRight + deltaAng);

		Tmp.v1.set(-offsetX, offsetY);
		Tmp.v1.rotate(u.rotation - 90);

		Draw.rect(this.mandibleLeftRegion, u.x + Tmp.v1.x, u.y + Tmp.v1.y, u.rotation - 90 + baseAngLeft - deltaAng);


	}
});
Kagrax.constructor = prov(() => extend(LegsUnit, {}));


const CrawlersThrowerWeapon = extend(Weapon, "kagrax-cannon", {

	load() {
		this.super$load()

		this.outlineRegion = Core.atlas.find("uni-kagrax-cannon-outline");
		this.heatRegion = Core.atlas.find("error");
		this.region = Core.atlas.find("uni-kagrax-cannon");
	}

});
const kagraxCannonExplode = loadSound("kagrax-cannon-sound");

CrawlersThrowerWeapon.reload = 300;
CrawlersThrowerWeapon.rotate = true;
CrawlersThrowerWeapon.mirror = false;
CrawlersThrowerWeapon.ejectEffect = Fx.casing3;
CrawlersThrowerWeapon.bullet = CrawlersBullet;
CrawlersThrowerWeapon.shootSound = kagraxCannonExplode;

CrawlersThrowerWeapon.rotateSpeed = 0.7;
CrawlersThrowerWeapon.shake = 20;
CrawlersThrowerWeapon.recoil = 6;

CrawlersThrowerWeapon.range = 210;
CrawlersThrowerWeapon.shots = 1;

CrawlersThrowerWeapon.x = 0;
CrawlersThrowerWeapon.y = -20;
CrawlersThrowerWeapon.shootY = 15.0;


try {
	Events.on(ClientLoadEvent, cons(e => {
		try {
			if (!Vars.headless) CrawlersThrowerWeapon.load()
			Kagrax.weapons.add(CrawlersThrowerWeapon);
		} catch (e) {
			print(e)
			print(e.stack)
		}
	}))
} catch (e) {
	print(e)
	print(e.stack)
}
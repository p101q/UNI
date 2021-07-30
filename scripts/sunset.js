const sunsetTrail = new Effect(9,e=>{
    if(Core.settings.getBool("bloom")){
        Draw.rect("uni-sunset-engine",e.x,e.y,e.rotation);
    } else {
        Draw.blend(Blending.additive);
        Draw.color(Color.valueOf("#d19719"),0.5);
        Draw.rect("uni-sunset-engine",e.x,e.y,e.rotation);
        Draw.blend();
    }
    
});

const sunset = extendContent(UnitType, "sunset", {
    update(u) {
        this.super$update(u);
        sunsetTrail.at(u.x,u.y,u.rotation-90);
    }
});
sunset.constructor = prov(() => extend(UnitEntity, {}));
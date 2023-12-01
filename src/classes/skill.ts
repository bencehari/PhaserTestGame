class SkillBase {
	constructor(atlas: string, frame: string, castDelay: number, speed: number, lifetime: number, baseHitChance: number, rangeSq: number) {
		this.atlas = atlas
		this.frame = frame
		this.castDelay = castDelay
		this.speed = speed
		this.lifetime = lifetime
		this.baseHitChance = baseHitChance
		this.rangeSq = rangeSq
	}

	public atlas: string
	public frame: string
	public castDelay: number
	public speed: number
	public lifetime: number
	public baseHitChance: number
	public rangeSq: number
}

export class Spell extends SkillBase {
	constructor(atlas: string, frame: string, castDelay: number, speed: number, lifetime: number, baseHitChance: number, rangeSq: number) {
		super(atlas, frame, castDelay, speed, lifetime, baseHitChance, rangeSq)
	}
}
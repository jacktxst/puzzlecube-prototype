export default {

	async init() {

		this.ctx = new AudioContext();
		this.audioBuffers = {};

		this.currentSource = null;
		this.currentGain = null;
		this.currentTrack = null;

		this.fadeTime = 1.0; // seconds

		await Promise.all([
			this.loadTrack("mus_level1.mp3"),
			this.loadTrack("mus_level2.mp3"),
			this.loadTrack("mus_level3.mp3"),
			this.loadTrack("mus_level4.mp3"),
			this.loadTrack("mus_level5.mp3"),
		]);

	},

	async loadTrack(name) {
		const response = await fetch("./assets/"+name);
		const arrayBuffer = await response.arrayBuffer();
		this.audioBuffers[name] = await this.ctx.decodeAudioData(arrayBuffer);
	},

	play(trackName) {

		if (this.currentTrack === trackName)
			return;

		const buffer = this.audioBuffers[trackName];
		if (!buffer) {
			console.warn(`Music track "${trackName}" not found.`);
			return;
		}

		const now = this.ctx.currentTime;

		if (this.currentSource && this.currentGain) {

			this.currentGain.gain.cancelScheduledValues(now);
			this.currentGain.gain.setValueAtTime(
				this.currentGain.gain.value,
				now
			);
			this.currentGain.gain.linearRampToValueAtTime(
				0,
				now + this.fadeTime
			);

			const oldSource = this.currentSource;

			setTimeout(() => {
				try {
					oldSource.stop();
				} catch {}
			}, this.fadeTime * 1000);
		}

		const source = this.ctx.createBufferSource();
		source.buffer = buffer;
		source.loop = true;

		const gain = this.ctx.createGain();
		gain.gain.setValueAtTime(0, now);

		source.connect(gain);
		gain.connect(this.ctx.destination);

		source.start(now);

		gain.gain.linearRampToValueAtTime(
			1,
			now + this.fadeTime
		);

		this.currentSource = source;
		this.currentGain = gain;
		this.currentTrack = trackName;
	},

	stop() {

		if (!this.currentSource || !this.currentGain)
			return;

		const now = this.ctx.currentTime;

		this.currentGain.gain.cancelScheduledValues(now);
		this.currentGain.gain.setValueAtTime(
			this.currentGain.gain.value,
			now
		);
		this.currentGain.gain.linearRampToValueAtTime(
			0,
			now + this.fadeTime
		);

		const source = this.currentSource;

		setTimeout(() => {
			try {
				source.stop();
			} catch {}
		}, this.fadeTime * 1000);

		this.currentSource = null;
		this.currentGain = null;
		this.currentTrack = null;
	}

};
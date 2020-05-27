export interface SpectrumAnalyserOptions {
    fftSize: 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768,
    backgroundColor: string;
    spectrumColor: string;
}

export class SpectrumAnalyser {
    private analyser: AnalyserNode;
    private backgroundColor: string;
    private spectrumColor: string;
    private running = false;
    private data: Uint8Array | null = null;

    constructor(
        public element: HTMLCanvasElement,
        public audioCtx: AudioContext,
        {
            fftSize = 8192,
            backgroundColor = 'rgb(0, 0, 0)',
            spectrumColor = 'gray',
        }: Partial<SpectrumAnalyserOptions> = {}) {
        this.element = element;
        this.audioCtx = audioCtx;
        this.analyser = audioCtx.createAnalyser();
        this.analyser.fftSize = fftSize;
        this.backgroundColor = backgroundColor;
        this.spectrumColor = spectrumColor;
    }

    connect(audioSource) {
        audioSource.connect(this.analyser);
    }

    disconnect(audioSource) {
        audioSource.disconnect(this.analyser);
    }

    start() {
        this.running = true;
        this.data = new Uint8Array(this.analyser.frequencyBinCount);
        this.frame();
    }

    stop() {
        this.running = false;
        this.data = null;
    }

    frame = () => {
        if (!this.running) return;

        this.analyser.getByteFrequencyData(this.data);
        this.renderFrame();

        requestAnimationFrame(this.frame);
    }

    renderFrame() {
        let width = this.element.offsetWidth * window.devicePixelRatio;
        let height = this.element.offsetHeight * window.devicePixelRatio;
        let logMinFreq = Math.log10(10);
        let logMaxFreq = Math.log10(this.audioCtx.sampleRate / 2);
        this.element.width = width;
        this.element.height = height;

        let ctx = this.element.getContext("2d");

        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = this.spectrumColor;

        ctx.beginPath();
        ctx.moveTo(0, height);
        let x = 0;
        for (let i = 0; i < this.data.length; i++) {
            let binFreq = (i * this.audioCtx.sampleRate) / this.analyser.fftSize;
            let x =
                ((Math.log10(binFreq) - logMinFreq) / (logMaxFreq - logMinFreq)) *
                width;
            let pointHeight = (this.data[i] / 256) * height;
            ctx.lineTo(x, height - pointHeight);
        }
        ctx.lineTo(width, height);
        ctx.fill();
    }
}
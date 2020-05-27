# Web Audio Spectrum Analyser

Visualises the spectrum of any Web Audio node. Uses log scale for both frequency and amplitude.

## Install

```
npm install @teropa/spectrum-analyser
```

ES Modules, CommonJS modules, and an UMD build are all provided.

## Usage

Create an analyser and attach it to an existing `<canvas>` element, then connect it to an AudioNode and start visualising:

```js
import { SpectrumAnalyser } from "@teropa/spectrum-analyser";

let spectrum = new SpectrumAnalyser(myCanvasElement, audioContext, {
  fftSize: 8192,
});
spectrum.connect(myAudioNode);
spectrum.start();
```

The canvas visualisatioon will be sized according to the natural (CSS-based) size of the canvas.

The third argument to the constructor supports the following options:

- `fftSize` - number - the FFT size of the backing AnalyserNode. This affects the resolution of the spectrum analysis.
- `backgroundColor` - string - the (CSS) color to use for the visualisation background
- `spectrumColor` - string - the (CSS) color to use for the filled spectrum

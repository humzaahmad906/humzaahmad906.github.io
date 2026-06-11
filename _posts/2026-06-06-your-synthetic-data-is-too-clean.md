---
title: "Your Synthetic Data Is Too Clean"
date: 2026-06-06
author: Humza Ahmad
description: "Realism is a vanity metric. What actually matters is covering the specific ways your documents break in your environment."
---

There's a failure mode in synthetic data pipelines that doesn't show up until production: your generated documents are pristine, your model scores 99% in the lab, and then it falls apart on real warehouse captures. Ours dropped to roughly 61% the first time it met reality.

The instinct at that point is to make the synthetic data look more realistic. That's the wrong goal. The domain randomization work from Tobin et al. back in 2017 already made this point — realism was never the target, coverage of variation was. What your model needs isn't prettier fakes. It's systematic exposure to the specific physical degradations your documents actually suffer.

For warehouse documents, I ended up with six families that matter: thermal fade (non-uniform, from heat and UV), anisotropic motion blur (directional, not the radial blur most augmentation libraries give you), perspective and geometric distortion, stacked JPEG compression, occlusion and specular highlights, and signal-dependent sensor noise.

Here's the counterintuitive part. Visual severity is a weak predictor of difficulty. A low-severity glass blur that looks barely noticeable cost us about 8 points of accuracy. Geometric distortions that look almost harmless caused drops of up to 34 points. The augmentations you'd skip because they "don't look like much" are the ones quietly killing your model.

Once we anchored augmentation to measured failures instead of visual plausibility — and closed the loop so production failures feed back into targeted regeneration — the same model went from ~61% to ~86% on real captures. About 25 points recovered, no architecture change.

The full piece walks through the augmentation taxonomy, the label-fidelity thresholds that keep synthetic data from poisoning your training set, and how the closed-loop system compounds into something a competitor can't copy.

[Read the full article on Medium →](https://medium.com/@humzaahmad9066/your-synthetic-data-is-too-clean-78029d840acc)

---
title: "Can an LLM Take Your On-Call Shift?"
date: 2026-06-11
author: Humza Ahmad
description: "What current research says about LLM-driven root cause analysis. Some of it is genuinely useful. Some of it scored below a coin flip."
---

Incident response is really two different jobs wearing one pager. The first is triage: pull the relevant logs, correlate across services, figure out what's anomalous, and hand a human a coherent picture. The second is diagnosis: pinpoint the exact failure and decide what to roll back.

LLMs are surprisingly good at the first job and surprisingly bad at the second — and the gap between those two facts is where most "AI for incident response" projects go wrong.

The good news is real. One industrial case study wired Llama-3.3 into Prometheus and Loki and cut investigation time from 90 minutes to under 5, with engineers rating 80–85% of the generated analyses as accurate. That's the tab-juggling, log-grepping reconstruction grind — automated away with an off-the-shelf observability stack.

The bad news is just as real. On the Who&When benchmark, models identified the responsible component 53.5% of the time, but found the decisive error step only 14.2% of the time. Several strategies did worse than random. Causal attribution — the actual "root cause" part of root cause analysis — is still not something you can delegate.

The systems that work share a shape: multi-modal telemetry (metrics, logs, and traces together, not logs alone), bounded hypothesis spaces built from causal graphs so the model can't speculate freely, and structured output where every claim has to cite a supporting log line. The architecture I'd recommend is four layers — statistical detection, deterministic correlation, a single model call for narration, then a human verdict — with zero model authority over the final conclusion.

So no, an LLM can't take your on-call shift. But it can take the worst hour of it.

[Read the full article on Medium →](https://medium.com/@humzaahmad9066/can-an-llm-take-your-on-call-shift-d56869064987)

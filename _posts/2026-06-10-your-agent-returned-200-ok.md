---
title: "Your Agent Returned 200 OK. It Was Still Wrong."
date: 2026-06-10
author: Humza Ahmad
description: "Debugging production AI agents when there's no stack trace to read."
---

Traditional software fails loudly. It crashes, it throws, it leaves a stack trace pointing at the guilty line. LLM agents do something worse: they return 200 OK, every health check passes, and the answer is semantically wrong. Nothing in your observability stack even blinks.

Three things break down when you try to debug these systems the old way. You can't reproduce the failure — same input doesn't mean same output. You can't tell right answers from wrong ones structurally — both are well-formed JSON. And in a multi-step pipeline, blame diffuses: was it the retrieval step, the tool call, or the synthesis at the end?

The Who&When paper (ICML 2025) gives this a useful name: the decisive error step — the earliest mistake that, if corrected, flips the outcome from failure to success. Finding it is the whole game, and you can't find it without traces.

So traces become the architecture. Hierarchical spans, borrowed straight from distributed tracing, capturing model calls with parameters, tool interactions, the actual content payloads, and token costs. The TraceElephant benchmark puts numbers on this: full traces improve failure attribution accuracy by up to 76% compared to partial logging. OpenTelemetry's GenAI conventions have standardized the `gen_ai.*` attributes since 2024, so there's no excuse to invent your own schema.

The debugging loop that falls out of this: replay recorded traces instead of re-running (re-running gives you a different failure), binary-search the trace for the first divergence point, classify the failure into a family — stale context, wrong tool selection, retrieval miss — and then turn every diagnosis into an evaluation case so it can't regress silently.

The takeaway I keep coming back to: there's no breakpoint you can set inside a model's reasoning. Trace capture isn't post-launch plumbing for agent systems. It's the only debugger you get.

[Read the full article on Medium →](https://medium.com/@humzaahmad9066/your-agent-returned-200-ok-it-was-still-wrong-8cbf9f53be1d)

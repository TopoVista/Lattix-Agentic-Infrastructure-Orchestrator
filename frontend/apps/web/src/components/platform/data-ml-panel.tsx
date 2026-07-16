"use client";

import { Database, Layers, Zap, FlaskConical, Eye, Mic } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

const DATA_PIPELINES = [
  { name: "raw-events → bronze", engine: "Kafka → Flink", throughput: "12,400 msg/s", latency: "23ms", status: "running" },
  { name: "bronze → silver (enrichment)", engine: "Flink SQL", throughput: "8,200 rec/s", latency: "145ms", status: "running" },
  { name: "silver → gold (aggregation)", engine: "Spark Batch", throughput: "2hr window", latency: "scheduled", status: "running" },
  { name: "feature-store sync", engine: "Airflow DAG", throughput: "hourly", latency: "on-schedule", status: "running" },
];

const ML_MODELS = [
  { name: "code-quality-classifier", version: "v2.1.0", framework: "PyTorch", status: "serving", accuracy: "94.2%", p50: "38ms", p99: "89ms" },
  { name: "infra-anomaly-detector", version: "v1.3.2", framework: "scikit-learn", status: "serving", accuracy: "97.8%", p50: "12ms", p99: "34ms" },
  { name: "cost-forecaster", version: "v1.0.1", framework: "Prophet", status: "serving", accuracy: "91.5%", p50: "56ms", p99: "120ms" },
  { name: "incident-classifier", version: "v0.8.0", framework: "HuggingFace", status: "training", accuracy: "86.4%", p50: "-", p99: "-" },
  { name: "pr-review-ranker", version: "v1.1.0", framework: "PyTorch", status: "serving", accuracy: "89.1%", p50: "210ms", p99: "450ms" },
];

const CV_TASKS = [
  { name: "Architecture diagram parser", input: "PNG/SVG", output: "Component graph JSON", status: "ready" },
  { name: "Screenshot → UI code", input: "Screenshot", output: "React/HTML", status: "ready" },
  { name: "OCR document extraction", input: "PDF/Image", output: "Structured text", status: "ready" },
  { name: "Whiteboard digitizer", input: "Photo", output: "Diagram + Mermaid", status: "beta" },
];

const SIGNAL_TASKS = [
  { name: "Meeting transcription", tech: "Whisper", languages: "40+", status: "ready" },
  { name: "Speaker diarization", tech: "pyannote.audio", languages: "en/es/fr", status: "ready" },
  { name: "Alarm detection", tech: "librosa", input: "audio stream", status: "ready" },
  { name: "Sentiment analysis", tech: "HuggingFace", input: "transcript", status: "ready" },
];

const STATUS_DOT = ({ s }: { s: string }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${s === "running" || s === "serving" || s === "ready" ? "bg-accent2/20 text-accent2" : s === "training" || s === "beta" ? "bg-warning/20 text-warning" : "bg-muted/20 text-muted"}`}>
    <span className={`size-1.5 rounded-full ${s === "running" || s === "serving" || s === "ready" ? "bg-accent2" : "bg-warning"} animate-pulse`} />
    {s}
  </span>
);

export function DataMLPanel() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border border-line bg-[#080f1e] p-3">
        {["P08 Database Layer","P20 Data Engineering","P21 ML Platform","P22 Computer Vision","P23 Signal Processing"].map(p => (
          <span key={p} className="rounded-md border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-2 py-1 text-[10px] font-mono text-[#f59e0b]">{p}</span>
        ))}
      </div>

      {/* Data pipelines */}
      <Card><CardHeader><div className="flex items-center gap-2 text-sm font-semibold"><Layers className="size-4 text-[#f59e0b]"/>Data Engineering Pipelines (Phase 20)</div></CardHeader>
        <CardBody className="space-y-2">
          {DATA_PIPELINES.map(p => (
            <div key={p.name} className="flex items-center gap-3 rounded-lg border border-line bg-[#080f1e] px-4 py-3">
              <div className="flex-1">
                <div className="text-sm font-medium text-text">{p.name}</div>
                <div className="text-[11px] text-muted">{p.engine}</div>
              </div>
              <div className="text-right text-xs text-muted hidden md:block">
                <div>{p.throughput}</div>
                <div>lat: {p.latency}</div>
              </div>
              <STATUS_DOT s={p.status} />
            </div>
          ))}
        </CardBody>
      </Card>

      {/* ML Models */}
      <Card><CardHeader><div className="flex items-center gap-2 text-sm font-semibold"><FlaskConical className="size-4 text-[#a78bfa]"/>ML Platform — Model Registry (Phase 21)</div></CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[10px] uppercase tracking-widest text-muted border-b border-line">
              <th className="pb-2 pr-4">Model</th>
              <th className="pb-2 pr-4">Version</th>
              <th className="pb-2 pr-4">Framework</th>
              <th className="pb-2 pr-4">Accuracy</th>
              <th className="pb-2 pr-4">p50</th>
              <th className="pb-2">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-line/40">
              {ML_MODELS.map(m => (
                <tr key={m.name}>
                  <td className="py-2 pr-4 font-mono text-[11px] text-text">{m.name}</td>
                  <td className="py-2 pr-4 text-xs text-muted">{m.version}</td>
                  <td className="py-2 pr-4 text-xs text-[#7dd3fc]">{m.framework}</td>
                  <td className="py-2 pr-4 text-xs text-accent2">{m.accuracy}</td>
                  <td className="py-2 pr-4 text-xs text-muted">{m.p50}</td>
                  <td className="py-2"><STATUS_DOT s={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Computer Vision */}
        <Card><CardHeader><div className="flex items-center gap-2 text-sm font-semibold"><Eye className="size-4 text-[#f472b6]"/>Computer Vision (Phase 22)</div></CardHeader>
          <CardBody className="space-y-2">
            {CV_TASKS.map(t => (
              <div key={t.name} className="rounded-lg border border-line bg-[#080f1e] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text">{t.name}</span>
                  <STATUS_DOT s={t.status} />
                </div>
                <div className="mt-1 text-[11px] text-muted">{t.input} → {t.output}</div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Signal Processing */}
        <Card><CardHeader><div className="flex items-center gap-2 text-sm font-semibold"><Mic className="size-4 text-[#60a5fa]"/>Signal Processing (Phase 23)</div></CardHeader>
          <CardBody className="space-y-2">
            {SIGNAL_TASKS.map(t => (
              <div key={t.name} className="rounded-lg border border-line bg-[#080f1e] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text">{t.name}</span>
                  <STATUS_DOT s={t.status} />
                </div>
                <div className="mt-1 text-[11px] text-muted">{t.tech} · {t.languages ?? t.input}</div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

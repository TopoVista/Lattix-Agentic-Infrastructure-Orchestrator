# Signal Processing — Developer Guide

> Speech transcription, speaker diarization, audio alarms, meeting intelligence, and frequency analysis.

## Overview (Phase 23)

The Signal Processing module handles all audio/speech workloads using Whisper (transcription), pyannote.audio (diarization), and librosa (signal analysis).

## Capabilities

### 1. Meeting Transcription (Whisper)

Transcribes audio in 40+ languages with timestamps and punctuation.

```python
from lattix_signal_processing import MeetingTranscriber

transcriber = MeetingTranscriber()

# Transcribe an audio file
result = transcriber.transcribe(
    audio_path="meetings/standup-2026-07-16.mp3",
    language="en",         # auto-detect if omitted
    timestamps=True,
    punctuate=True
)

print(f"Duration: {result.duration_seconds}s")
print(f"Words: {result.word_count}")
print(result.transcript)  # Full text

# Timestamped segments
for seg in result.segments:
    print(f"[{seg.start:.1f}s - {seg.end:.1f}s] {seg.text}")
```

### 2. Speaker Diarization (pyannote.audio)

Identifies who spoke when in a meeting recording.

```python
from lattix_signal_processing import SpeakerDiarizer

diarizer = SpeakerDiarizer()

result = diarizer.diarize(
    audio_path="meetings/planning-call.mp3",
    num_speakers=4    # Optional: auto-detect if omitted
)

for segment in result.segments:
    print(f"Speaker {segment.speaker}: [{segment.start:.1f}s - {segment.end:.1f}s] {segment.text}")

# Speaker stats
for speaker, stats in result.speaker_stats.items():
    print(f"{speaker}: {stats.speaking_time_seconds:.0f}s ({stats.percentage:.0%})")
```

### 3. Meeting Intelligence

Combines transcription + diarization + NLP to generate meeting summaries, action items, and decisions.

```python
from lattix_signal_processing import MeetingIntelligence

intel = MeetingIntelligence()

report = intel.analyze(
    audio_path="meetings/sprint-planning.mp3",
    participants=["Alice", "Bob", "Carol", "Dave"]
)

print("=== Summary ===")
print(report.summary)

print("\n=== Action Items ===")
for item in report.action_items:
    print(f"  [{item.owner}] {item.description} (due: {item.due_date})")

print("\n=== Decisions ===")
for decision in report.decisions:
    print(f"  {decision.description}")

print("\n=== Key Topics ===")
print(report.topics)
```

### 4. Alarm Detection (librosa)

Detects alarm sounds, alerts, and anomalous audio events in infrastructure audio streams.

```python
from lattix_signal_processing import AlarmDetector

detector = AlarmDetector()

# Analyze an audio stream
events = detector.detect(
    audio_path="audio/server-room.wav",
    sensitivity=0.8,
    event_types=["smoke-alarm", "ups-beep", "disk-fail-alert"]
)

for event in events:
    print(f"[{event.timestamp:.1f}s] {event.type} (confidence: {event.confidence:.0%})")
```

### 5. Sentiment Analysis

Analyzes emotional tone from meeting transcripts.

```python
from lattix_signal_processing import SentimentAnalyzer

analyzer = SentimentAnalyzer()

result = analyzer.analyze(
    text="The deployment went smoothly, the team is happy with the new release.",
    model="huggingface/distilbert-sentiment"
)

print(f"Overall: {result.overall}")     # positive/negative/neutral
print(f"Score: {result.score:.3f}")     # -1.0 to 1.0
print(f"Breakdown: {result.breakdown}") # per-sentence
```

## Running Tests

```bash
python -m pytest signal-processing/ -v
```

## Dependencies

```
openai-whisper     - Speech transcription (40+ languages)
pyannote.audio     - Speaker diarization
librosa            - Audio analysis and feature extraction
soundfile          - Audio I/O
transformers       - HuggingFace models (sentiment)
```

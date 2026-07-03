# Phase 23 - Signal Processing

## Goal

Build Lattix signal processing for noise reduction, voice activity detection, speaker diarization, speech-to-text, keyword spotting, meeting summarization, action items, alarm analysis, FFT frequency analysis, and audio event detection.

## Why This Phase Exists

Operational knowledge often arrives as speech, meetings, alerts, calls, and alarms. This phase lets Lattix convert audio into searchable transcripts, decisions, action items, incidents, and signals that agents can reason over.

## Success Criteria

- Audio files and streams can be ingested and processed.
- Speech-to-text, diarization, keyword spotting, summarization, and action item extraction are available.
- Production alarm audio can be classified and linked to incidents.
- FFT-based analysis and audio event detection produce structured signals.
- Outputs follow privacy, consent, retention, and access policies.

## Deliverables

- Signal processing service.
- Audio ingestion pipeline.
- Noise reduction and VAD module.
- Speech-to-text module.
- Speaker diarization module.
- Meeting summarization module.
- Action item extraction module.
- Alarm and audio event detection module.
- Frequency analysis module.

## Folder Structure

```text
signal-processing/
  service/
  ingestion/
  preprocessing/
  vad/
  diarization/
  speech-to-text/
  keyword-spotting/
  summarization/
  action-items/
  alarm-analysis/
  frequency-analysis/
  event-detection/
```

## Modules To Build

- Audio ingestion module.
- Preprocessing module for normalization and noise reduction.
- Voice activity detection module.
- Speaker diarization module.
- Speech-to-text module.
- Keyword spotting module.
- Meeting intelligence module.
- Alarm analysis module.
- FFT analysis module.
- Audio event detection module.

## Functionality

- Store audio assets with metadata and consent state.
- Reduce noise and segment speech.
- Transcribe speech with timestamps.
- Identify speakers or speaker turns where identity is unavailable.
- Extract keywords, decisions, blockers, and action items.
- Summarize meetings into organizational memory.
- Analyze alarms and production audio events.
- Run FFT-based analysis for frequency patterns.

## Tech Stack

- Python.
- FastAPI.
- Whisper.
- pyannote.audio.
- librosa.
- NumPy and SciPy.
- PyTorch.
- Object storage.
- Qdrant and knowledge graph integration.

## Implementation Plan

1. Define audio asset, transcript, speaker segment, keyword, summary, action item, and signal contracts.
2. Implement audio ingestion with content type, duration, checksum, source, consent, and retention metadata.
3. Implement preprocessing with normalization, denoising, resampling, and silence trimming.
4. Implement VAD and speaker diarization pipeline.
5. Implement speech-to-text with timestamps and confidence.
6. Implement keyword spotting for incidents, deadlines, owners, and technical terms.
7. Implement meeting summarization and action item extraction.
8. Implement alarm classification and audio event detection.
9. Implement FFT analysis for frequency-domain reports.
10. Export reviewed summaries and action items into memory and knowledge graph.

## Functions / Classes / Interfaces To Implement

```python
def ingest_audio(request: AudioIngestionRequest) -> AudioAsset:
    # Stores audio, captures source, consent, duration, checksum, and retention policy.

def preprocess_audio(asset: AudioAsset) -> PreprocessedAudio:
    # Normalizes, denoises, resamples, and prepares audio for speech or signal analysis.

def transcribe_audio(request: TranscriptionRequest) -> Transcript:
    # Produces timestamped text segments with confidence and language metadata.

def diarize_speakers(request: DiarizationRequest) -> DiarizationResult:
    # Assigns speaker turns and optional known speaker identities when allowed.

def extract_action_items(transcript: Transcript) -> ActionItemExtraction:
    # Finds decisions, owners, due dates, tasks, blockers, and follow-up items.

def analyze_alarm_audio(request: AlarmAnalysisRequest) -> AlarmSignalReport:
    # Classifies production alarm sounds and links signal evidence to incidents.
```

## Configuration / Environment Variables

- `AUDIO_UPLOAD_BUCKET`
- `WHISPER_MODEL`
- `DIARIZATION_MODEL`
- `SIGNAL_SAMPLE_RATE`
- `AUDIO_MAX_DURATION_SECONDS`
- `AUDIO_RETENTION_POLICY`
- `AUDIO_REQUIRES_CONSENT`

## Data Models / Schemas / Contracts

- `AudioAsset`: id, workspaceId, objectRef, source, duration, consentState, retention, checksum.
- `Transcript`: audioId, segments, language, confidence, createdAt.
- `SpeakerSegment`: speakerId, startMs, endMs, confidence.
- `MeetingSummary`: decisions, topics, risks, actionItems, evidence.
- `AudioEvent`: type, startMs, endMs, confidence, metadata.
- `FrequencyAnalysisReport`: bands, peaks, anomalies, sampleRate, duration.

## Testing Plan

- Audio preprocessing tests with sample files.
- Transcription fixture tests.
- Diarization tests with labeled speaker samples.
- Action item extraction tests on meeting transcripts.
- Alarm and FFT tests with synthetic and recorded samples.
- Privacy tests for retention and access policy.

## Acceptance Criteria

- Audio inputs produce transcripts, speaker segments, summaries, action items, or signal reports.
- Sensitive audio is governed by consent and retention policy.
- Summaries and action items include evidence timestamps.
- Meeting outputs can feed memory and knowledge graph.

## Risks And Mitigations

- Risk: speech recognition errors create false decisions. Mitigation: confidence, timestamps, and human review.
- Risk: privacy violations. Mitigation: consent metadata, retention policy, and access controls.
- Risk: noisy production audio reduces accuracy. Mitigation: preprocessing, confidence thresholds, and fallback labels.

## Next Phase Handoff

Phase 24 should use accumulated cloud, agent, tool, observability, and policy foundations to build cloud controllers.

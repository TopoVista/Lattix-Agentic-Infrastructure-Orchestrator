# Signal Processing

## Purpose

Contains audio and signal services for noise reduction, voice activity detection, diarization, speech-to-text, keyword spotting, meeting summaries, alarm analysis, FFT analysis, and audio event detection.

## Owner Type

AI platform engineering.

## Conventions

- Python packages use `lattix_signal_<module>`.
- Audio assets must include consent, retention, workspace, and source metadata.
- Meeting summaries and action items must include evidence timestamps.
- Sensitive transcripts must follow memory and compliance policies.

## Implemented Package

`lattix_signal_processing` implements the Phase 23 signal processing surface:

- `SignalProcessingService.ingest_audio` stores assets with duration, checksum, source, consent, and retention metadata.
- `preprocess_audio`, `detect_voice_activity`, `diarize_speakers`, and `transcribe_audio` produce speech-ready structured outputs.
- `spot_keywords`, `extract_action_items`, and `summarize_meeting` produce searchable meeting intelligence with evidence timestamps.
- `analyze_alarm_audio`, `detect_audio_events`, and `analyze_frequency` produce incident-linked alarm and FFT-style signal reports.
- `export_meeting_memory` emits memory records and graph facts for approved downstream use.

## Environment Variables

- `AUDIO_UPLOAD_BUCKET`
- `WHISPER_MODEL`
- `DIARIZATION_MODEL`
- `SIGNAL_SAMPLE_RATE`
- `AUDIO_MAX_DURATION_SECONDS`
- `AUDIO_RETENTION_POLICY`
- `AUDIO_REQUIRES_CONSENT`

## Future Phase Dependencies

- Phase 23 implements signal processing.
- Phase 15 consumes approved summaries as organizational memory.

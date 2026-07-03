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

## Future Phase Dependencies

- Phase 23 implements signal processing.
- Phase 15 consumes approved summaries as organizational memory.

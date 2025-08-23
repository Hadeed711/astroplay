# Audio Files for AstroPlay

This directory contains audio files for the AstroPlay application.

## Directory Structure:
```
/public/audio/
├── deep_space_ambient.mp3     - Deep space ambient sound
├── solar_wind.mp3             - Solar wind audio
├── pulsar_rhythm.mp3          - Pulsar rhythm sound
├── black_hole_accretion.mp3   - Black hole accretion disk
├── neutron_star_pulse.mp3     - Neutron star pulses
├── stellar_fusion.mp3         - Star fusion sounds
├── planetary_atmosphere.mp3   - Planetary atmosphere
├── object_select.wav          - Object selection sound
├── travel_start.wav           - Travel animation start
├── time_dilation.wav          - Time dilation effect
├── gravity_field.wav          - Gravity field toggle
├── escape_velocity.wav        - Escape velocity toggle
├── quiz_correct.wav           - Quiz correct answer
├── quiz_wrong.wav             - Quiz wrong answer
├── ui_click.wav               - UI click sound
└── ui_hover.wav               - UI hover sound
```

## Audio Files Status:
❌ Files not provided - using synthetic audio generation as fallback
✅ Synthetic audio system implemented for all interactions

## Note:
The application will work perfectly without audio files - it generates synthetic sounds using Web Audio API for all interactions. You can add real audio files later if desired.

## Recommended Audio Specifications:
- Format: MP3 for ambient sounds, WAV for short effects
- Sample Rate: 44.1kHz
- Bitrate: 128kbps for ambient, 320kbps for effects
- Duration: 
  - Ambient sounds: 30-60 seconds (looped)
  - UI effects: 0.1-0.5 seconds
  - Object effects: 1-3 seconds

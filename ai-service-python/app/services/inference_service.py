from __future__ import annotations

import os
import tempfile
import time
import uuid
from pathlib import Path

from fastapi import UploadFile

from .audio_processor import extract_audio_features
from .fusion_service import fuse_modalities
from .text_processor import extract_text_features
from .video_processor import extract_video_features


async def infer_sentiment_from_video(video: UploadFile, topic_text: str = '', transcript: str = '') -> dict:
    started = time.perf_counter()
    suffix = Path(video.filename or 'video.webm').suffix or '.webm'

    with tempfile.TemporaryDirectory() as tmp_dir:
        temp_path = os.path.join(tmp_dir, f'{uuid.uuid4().hex}{suffix}')
        with open(temp_path, 'wb') as out:
            content = await video.read()
            out.write(content)

        video_features = extract_video_features(temp_path)
        audio_features = extract_audio_features(temp_path)
        text_features = extract_text_features(transcript=transcript, topic_text=topic_text)

        fused = fuse_modalities(
            video_features=video_features,
            audio_features=audio_features,
            text_features=text_features,
            topic_text=topic_text,
        )

        processing_time_ms = int((time.perf_counter() - started) * 1000)
        return {
            **fused,
            'processing_time_ms': processing_time_ms,
            'video_features': video_features,
            'audio_features': audio_features,
            'text_features': {
                key: value
                for key, value in text_features.items()
                if key != 'transcript'
            },
            'transcript': text_features.get('transcript', ''),
            'topicText': topic_text,
            'multimodal_version': 'video-audio-text-v2',
        }

package com.westream.app.streaming

import android.media.MediaCodec
import android.media.MediaCodecInfo
import android.media.MediaFormat
import android.view.Surface
import java.nio.ByteBuffer

/**
 * Core RTMP Streaming Engine using MediaCodec (H.264/AAC).
 * This class handles the encoding of video frames and audio samples
 * and pushes them to an RTMP destination.
 */
class RtmpStreamer(
    private val rtmpUrl: String,
    private val streamKey: String
) {
    private var videoEncoder: MediaCodec? = null
    private var audioEncoder: MediaCodec? = null
    private var inputSurface: Surface? = null

    fun startStream(width: Int, height: Int, bitrate: Int, fps: Int) {
        setupVideoEncoder(width, height, bitrate, fps)
        setupAudioEncoder()
        // Initialize RTMP connection logic here (e.g., using a library like rtmp-rtmp-client)
    }

    private fun setupVideoEncoder(width: Int, height: Int, bitrate: Int, fps: Int) {
        val format = MediaFormat.createVideoFormat(MediaFormat.MIMETYPE_VIDEO_AVC, width, height)
        format.setInteger(MediaFormat.KEY_COLOR_FORMAT, MediaCodecInfo.CodecCapabilities.COLOR_FormatSurface)
        format.setInteger(MediaFormat.KEY_BIT_RATE, bitrate)
        format.setInteger(MediaFormat.KEY_FRAME_RATE, fps)
        format.setInteger(MediaFormat.KEY_I_FRAME_INTERVAL, 2)

        videoEncoder = MediaCodec.createEncoderByType(MediaFormat.MIMETYPE_VIDEO_AVC)
        videoEncoder?.configure(format, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE)
        inputSurface = videoEncoder?.createInputSurface()
        videoEncoder?.start()
    }

    private fun setupAudioEncoder() {
        val format = MediaFormat.createAudioFormat(MediaFormat.MIMETYPE_AUDIO_AAC, 44100, 1)
        format.setInteger(MediaFormat.KEY_BIT_RATE, 64000)
        format.setInteger(MediaFormat.KEY_AAC_PROFILE, MediaCodecInfo.CodecProfileLevel.AACObjectLC)

        audioEncoder = MediaCodec.createEncoderByType(MediaFormat.MIMETYPE_AUDIO_AAC)
        audioEncoder?.configure(format, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE)
        audioEncoder?.start()
    }

    fun stopStream() {
        videoEncoder?.stop()
        videoEncoder?.release()
        audioEncoder?.stop()
        audioEncoder?.release()
        inputSurface?.release()
    }

    fun getInputSurface(): Surface? = inputSurface
}

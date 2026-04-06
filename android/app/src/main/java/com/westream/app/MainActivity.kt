package com.westream.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import com.westream.app.ui.StreamingScreen
import com.westream.app.streaming.CameraHandler
import com.westream.app.streaming.RtmpStreamer

class MainActivity : ComponentActivity() {
    private lateinit var cameraHandler: CameraHandler
    private var rtmpStreamer: RtmpStreamer? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        cameraHandler = CameraHandler(this)

        setContent {
            var isStreaming by remember { mutableStateOf(false) }

            StreamingScreen(
                onStartStream = {
                    // Initialize streamer with your RTMP URL and Key
                    rtmpStreamer = RtmpStreamer("rtmp://stream.westream.app/live", "your_key")
                    rtmpStreamer?.startStream(1280, 720, 2500000, 30)
                    isStreaming = true
                },
                onStopStream = {
                    rtmpStreamer?.stopStream()
                    isStreaming = false
                },
                isStreaming = isStreaming
            )
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        cameraHandler.stopCamera()
        rtmpStreamer?.stopStream()
    }
}

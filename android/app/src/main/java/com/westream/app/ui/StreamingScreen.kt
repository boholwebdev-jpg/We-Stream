package com.westream.app.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.camera.view.PreviewView

/**
 * Modern Jetpack Compose UI for the Streaming Screen.
 * Includes camera preview, start/stop controls, and overlay simulation.
 */
@Composable
fun StreamingScreen(
    onStartStream: () -> Unit,
    onStopStream: () -> Unit,
    isStreaming: Boolean
) {
    Box(modifier = Modifier.fillMaxSize()) {
        // Camera Preview
        AndroidView(
            factory = { context ->
                PreviewView(context).apply {
                    implementationMode = PreviewView.ImplementationMode.COMPATIBLE
                }
            },
            modifier = Modifier.fillMaxSize()
        )

        // Overlay Controls
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            verticalArrangement = Arrangement.Bottom,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            if (isStreaming) {
                Text(
                    text = "LIVE",
                    color = Color.Red,
                    style = MaterialTheme.typography.headlineSmall,
                    modifier = Modifier.padding(bottom = 16.dp)
                )
            }

            Button(
                onClick = { if (isStreaming) onStopStream() else onStartStream() },
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isStreaming) Color.Red else Color.Green
                ),
                modifier = Modifier.height(56.dp).fillMaxWidth(0.6f)
            ) {
                Text(if (isStreaming) "Stop Stream" else "Start Stream")
            }
        }

        // Chat Overlay Simulation
        Box(
            modifier = Modifier
                .align(Alignment.TopStart)
                .padding(16.dp)
                .width(200.dp)
                .height(300.dp)
        ) {
            // Chat messages would be rendered here
        }
    }
}

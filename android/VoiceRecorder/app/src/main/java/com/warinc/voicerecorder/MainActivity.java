package com.warinc.voicerecorder;

import android.app.Activity;
import android.os.Bundle;
import android.os.Environment;
import android.os.ParcelFileDescriptor;
import android.view.Menu;
import android.view.MenuItem;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.UnknownHostException;

import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;


public class MainActivity extends Activity {

    private Button startButton,stopButton;

    public static DatagramSocket socket;
    private int port=50005;
    MediaRecorder recorder;

    private int sampleRate = 44100;
    private int channelConfig = AudioFormat.CHANNEL_CONFIGURATION_MONO;
    private int audioFormat = AudioFormat.ENCODING_PCM_16BIT;
    int minBufSize = AudioRecord.getMinBufferSize(sampleRate, channelConfig, audioFormat);
    private boolean status = true;

    //make a pipe containing a read and a write parcelfd
    ParcelFileDescriptor[] fdPair;

    ParcelFileDescriptor readFD;
    ParcelFileDescriptor writeFD;

    FileInputStream reader;

    private static final int BUFFER_SIZE = 30720;
    byte[] buffer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        startButton = (Button) findViewById (R.id.start_button);
        stopButton = (Button) findViewById (R.id.stop_button);
        createStreams();

        startButton.setOnClickListener (startListener);
        stopButton.setOnClickListener (stopListener);

        minBufSize += 2048;
        System.out.println("minBufSize: " + minBufSize);
    }

    private void createStreams() {
        buffer = new byte[BUFFER_SIZE];
        try {
            fdPair = ParcelFileDescriptor.createPipe();
        } catch(IOException ex) {
            Log.e("Error creating parcel: ", ex.getMessage());
        }
        readFD = fdPair[0];
        writeFD = fdPair[1];

        reader = new FileInputStream(readFD.getFileDescriptor());
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    private final OnClickListener stopListener = new OnClickListener() {

        @Override
        public void onClick(View arg0) {
            status = false;
            try {
                recorder.stop();
            } catch(RuntimeException ex) {
                recorder.release();
            }
            Log.d("VS", "Recorder released");
        }
    };

    private final OnClickListener startListener = new OnClickListener() {

        @Override
        public void onClick(View arg0) {
            status = true;
            startStreaming();
        }

    };

    @Override
    protected void onStop() {
        super.onStop();
    }

    public void startStreaming() {


        Thread streamThread = new Thread(new Runnable() {

            @Override
            public void run() {
                try {

//                    DatagramSocket socket = new DatagramSocket();
//                    Log.d("VS", "Socket Created");

//                    byte[] buffer = new byte[minBufSize];

//                    Log.d("VS","Buffer created of size " + minBufSize);
//                    DatagramPacket packet;
//
//                    final InetAddress destination = InetAddress.getByName("192.168.1.5");
//                    Log.d("VS", "Address retrieved");
                    File path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS);


                    recorder = new MediaRecorder();
                    recorder.setAudioSource(MediaRecorder.AudioSource.VOICE_RECOGNITION);
                    recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
                    recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
                    recorder.setOutputFile(writeFD.getFileDescriptor());
                    recorder.prepare();
                    recorder.start();
                    reader.read(buffer);
                    int i = 0;
                    while(true) {
                        if(buffer.length == BUFFER_SIZE) {
                            File file = new File(path, "/" + "test_" + i + ".3gpp");
                            BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(file));
                            bos.write(buffer);
                            bos.flush();
                            bos.close();
                            i++;
                            buffer = new byte[BUFFER_SIZE];
                        }
                    }
                    //reader.read(buffer);// may want to do this in a separate thread
                    //Log.d("VS", "Recorder initialized");

//                    while(status == true) {


                        //reading data from MIC into buffer
                        //minBufSize = recorder.read(buffer, 0, buffer.length);

                        //putting buffer in the packet
                       // packet = new DatagramPacket (buffer,buffer.length,destination,port);

                        //socket.send(packet);
                        //System.out.println("MinBufferSize: " +minBufSize);
//                    }
                } catch(UnknownHostException e) {
                    Log.e("VS", "UnknownHostException");
                } catch (IOException e) {
                    e.printStackTrace();
                    Log.e("VS", e.getMessage());
                }
            }

        });
        streamThread.start();
    }
}

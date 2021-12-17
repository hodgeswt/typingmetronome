import React, { useEffect, useState, useRef } from 'react';
import {Howl} from 'howler';

export default function Metronome() {

    const click = new Howl({
        src: ['/click.mp3'],
        volume: 0.20
    })

    const [toPlay, setToPlay] = useState(false);
    const [tempo, _setTempo] = useState(60);
    const [rate, setRate] = useState(500);
    const [enable, setEnable] = useState(false);
    const tempoRef = useRef(0);

    const setTempo = (newTempo) => {
        _setTempo(newTempo);
        setRate(newTempo * (1/12) * 1000);
    }

    useEffect(() => {
        if (enable) {
            setTimeout(() => {
                click.play();
                setToPlay(!toPlay);
            }, rate);
        }
    }, [toPlay, enable]);

    const childStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <div>
            <div className="metronomeSettings" style={childStyle}>
                <input type="number" min="20" max="240" value={tempo} ref={tempoRef} onChange={() => {
                    setTempo(tempoRef.current.value);
                    setEnable(false);
                    click.stop();
                }}/>
                <span style={{padding: '10px'}}>WPM</span>
            </div>
            <div className="startButton" style={childStyle}>
                <button onClick={() => setEnable(!enable)}>{enable ? 'Stop Metronome' : 'Start Metronome'}</button>
            </div>
        </div>
    )
}
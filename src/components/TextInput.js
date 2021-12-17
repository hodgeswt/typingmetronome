import React, { useRef, useState, useEffect } from "react";

import words from './wordlist.txt';

export default function TextInput() {
    const containerStyle = {
        display: "flex",
        width: '100%',
        flexDirection: "column",
        alignItems: "center",
    };

    const boxStyle = {
        borderRadius: "20px",
        width: "85%",
        height: "50px",
        fontSize: "40px",
        fontFamily: "Courier",
        fontWeight: "bold",
        textAlign: "center",
    };

    const inputRef = useRef(null);
    const [content, setContent] = useState([]);
    const [sampleText, setSampleText] = useState([]);
    const [wordDict, setWordDict] = useState([])
    const [index, setIndex] = useState(0);

    const [firstInput, setFirstInput] = useState(true);
    const [startTime, setStartTime] = useState(0);
    const [timeSet, setTimeSet] = useState(false);
    const [result, setResult] = useState([]);

    const [displayText, setDisplayText] = useState(false);
    const [displayResult, setDisplayResult] = useState(false);

    var onInput = () => {
        var word = inputRef.current.value;
        if (firstInput) {
            setStartTime(new Date());
            setFirstInput(false);
        }

        if (word.slice(-1) !== ' ' && word.slice(-1) !== '.') {
            var update = Object.assign([], content);
            if (update.length > 0 && update[update.length - 1].slice(-1) !== ' ') {
                update[update.length - 1] = word.trimStart();
            } else {
                update.push(word);
            }
            setContent(update);
        } else if (word.trim().length >= sampleText[index].length) {
            inputRef.current.value = ''
            var update = Object.assign([], content);
            update[update.length - 1] = word.trimStart();
            setContent(update);
            setIndex(index + 1);
        }
    };

    useEffect(() => {
        if (content.length === sampleText.length && !timeSet && content[content.length - 1] !== undefined) {
            if (content[content.length - 1].length >= sampleText[content.length - 1].length) {
                var endTime = new Date();
                var secondsTaken = (endTime.getTime() - startTime.getTime()) / 1000;
                var cpm = ((content.join(' ').length / secondsTaken) * 60) - 25;
                var wpm = cpm / 5;

                var errors = 0;
                for (var i = 0; i < content.length; i++) {
                    var typed = content[i].trim().split('');
                    var actual = sampleText[i].trim().split('');

                    for (var j = 0; j < typed.length; j++) {
                        if (actual[j] === undefined || typed[j] !== actual[j]) {
                            errors++;
                        }
                    }

                    if (actual.length > typed.length) {
                        errors += actual.length - typed.length;
                    }
                }

                var epm = (errors / secondsTaken) * 60;
                var correctedWpm = wpm - epm;

                setTimeSet(true);
                setDisplayResult(true);
                setResult([cpm, wpm, correctedWpm]);
            }
        }
    }, [content])

    var createText = () => {
        var text = [];
        for (var i = 0; i < 10; i++) {
            text.push(wordDict[Math.floor(Math.random() * wordDict.length)]);
        }
        text[text.length - 1] += '.';
        setContent([]);
        setFirstInput(true);
        setStartTime(0);
        setSampleText(text);
        setDisplayText(true);
        setTimeSet(false);
        setDisplayResult(false);
    };

    useEffect(() => {
        fetch(words)
            .then(response => response.text())
            .then(text => {
                setWordDict(text.split('\n'))
            });
    }, []);

    useEffect(() => {
        createText();
    }, [wordDict]);

    const textStyle = {
        textAlign: 'center',
        fontSize: '30px',
        fontFamily: "Courier",
        fontWeight: "bold"
    }

    return (
        <div style={containerStyle}>
            <div style={containerStyle}>
                <button onClick={createText} style={{margin: '10px'}}>New Test</button>
                {
                    <div>
                        <p style={textStyle}>{displayResult ? "Uncorrected CPM: " + Math.floor(result[0]) + " Uncorrected WPM: " + Math.floor(result[1]) : ''}</p>
                        <p style={textStyle}>{displayResult ? "Corrected WPM: " + Math.floor(result[2]) : ''}</p>
                    </div>
                }
                <div style={textStyle}>
                    {
                        displayText ?
                            sampleText.map((word, i) => {
                                if (word !== undefined) {
                                    return (
                                        word.split('').map((character, c) => {
                                            var color = "gray"
                                            var disp = character
                                            var append = ""

                                            if (content !== []) {
                                                if (content[i] !== undefined) {
                                                    // If we have a corresponding word
                                                    if (content[i][c] !== undefined) {
                                                        if (content[i][c] === character) {
                                                            color = "green"
                                                        } else {
                                                            color = "red"
                                                            disp = content[i][c] !== " " ? content[i][c] : "_"
                                                        }
                                                    }
                                                }
                                            }

                                            if (word.length - 1 === c) {
                                                append = " "
                                            }

                                            return (
                                                <span key={c} style={{color: color}}>{disp + append}</span>
                                            )
                                        })
                                    )
                                } else {
                                    return ''
                                }
                            })
                        : ''
                    }
                </div>
            </div>
            {
                !displayResult ? (
                    <div style={boxStyle}>
                        <input style={boxStyle} type="text" onChange={onInput} ref={inputRef} />
                    </div>
                ) : ''
            }
        </div>
    );
}

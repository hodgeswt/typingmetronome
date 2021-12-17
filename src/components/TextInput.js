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

    const [displayText, setDisplayText] = useState(false);

    var onInput = () => {
        var word = inputRef.current.value;

        // set last entry in content to be word
        if (word.slice(-1) !== ' ') {
            var update = Object.assign([], content);
            if (update.length > 0 && update[update.length - 1].slice(-1) !== ' ') {
                update[update.length - 1] = word.trimStart();
            } else {
                update.push(word);
            }
            setContent(update);
        } else if (word.trim().length >= sampleText[index].length) {
            // append word to content and store
            inputRef.current.value = ''
            var update = Object.assign([], content);
            update[update.length - 1] = word.trimStart();
            setContent(update);
            setIndex(index + 1);
        }
    };

    var createText = () => {
        var text = [];
        for (var i = 0; i < 100; i++) {
            text.push(wordDict[Math.floor(Math.random() * wordDict.length)]);
        }
        setContent([]);
        setSampleText(text);
        setDisplayText(true);
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

    return (
        <div style={containerStyle}>
            <div style={containerStyle}>
                <button onClick={createText} style={{margin: '10px'}}>Reset</button>
                <div style={{textAlign: 'center', fontSize: '30px', fontFamily: "Courier", fontWeight: "bold"}}>
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
            <div style={boxStyle}>
                <input style={boxStyle} type="text" onChange={onInput} ref={inputRef} />
            </div>
        </div>
    );
}

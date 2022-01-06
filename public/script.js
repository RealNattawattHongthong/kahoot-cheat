/*  Kaheet 
**  Kahoot cheat
** Author: RealNattawattHongthong

**  Kaheet is free software.
*  The author assumes no responsibility for any damages that may arise from the use of this software.
*  By using this software, you accept the terms of the GNU General Public License v3.0
*  The license can also be found at https://www.gnu.org/licenses/gpl-3.0.en.html

** Used consoleimg v1.0 and modified for my purposes
** You can found it on: https://github.com/workeffortwaste/consoleimg/

*** Pull requests are welcome
*** Github repositiory: https://github.com/RealNattawattHongthong/kahoot-cheat/
*/

let getLength = (string) => {
    if (string.length != 1) { return 's' } else { return '' }
}
let consoleimg = (function() {
    return {
        load: function(ind, { color: c = '#000000' } = {}) {
            let color = "";
            let question = q.question;
            let answer = q.answer;
            let reader = new FileReader();
            reader.addEventListener('load', function() {
                if (ind === 'https://i.imgur.com/DryHey4.png') {
                    color = '#ff6366';
                } else {
                    color = '#fc92f0';
                }
                let o = 'background: url(\'' + reader.result + `\') right top no-repeat; font-size: 30px; color: ${color}; border: 5px solid #000; background-size: contain; background-repeat: no-repeat; background-color:` + c
                if (question != "" || answer != "") {
                    console.log(`%cQuestion: ${question}     \n[${answer.length}] Answer${getLength(answer)}: ${answer.join('  &  ')}     `, o);
                }
            }, false)
            fetch(ind)
                .then(reader => reader.blob())
                .then(res => {
                    if (res.type.indexOf('image') === 0) {
                        if (res.size > 8192 && navigator.userAgent.indexOf('Firefox') > 0) {
                            throw new Error('Image size too big to be displayed in Firefox.');
                        }
                        return res
                    } else {
                        throw new Error('Valid image not found.');
                    }
                })
                .then(ind => reader.readAsDataURL(ind))
                .catch(e => { console.error(`%cThere was an error while loading images.`, "color:orange") })
        }
    }
})()
let getQuizid = (input) => {
    let data = [];
    let found = 0;
    let time = { "start": "", "end": "" };
    time.start = Date.now();
    fetch(`https://kahoot.it/rest/kahoots/${input}`)
        .then((r) => {
            if (!r.ok) {
                console.log(`%cCannot find quiz by id: ${input}! Please try again`, "color:#ff5252");
                getUserInput(`Cannot find quiz by id: ${input}`);
            } else {
                return r.json();
            }
        })
        .then((a) => {
            let quiz = { "author": "", "title": "", "questions": "", "found": "", "content": 0 };
            quiz.author = a.creator_username;
            quiz.title = a.title;
            let quiz_type = a.quizType;
            if (quiz_type) {
                if (quiz_type != "quiz") {
                    return alert(`This quiz type: ${quiz_type} is not supported yet!`);
                }
            }
            let k = Object.keys(a.questions).length;
            for (let i = 0; i < k; i++) {
                let img = "";
                q = { "question": "", "answer": [] };
                q.question = a.questions[i].question;
                if (a.questions[i].image) {
                    img = a.questions[i].image;
                } else {
                    if (a.questions[i].image.id) {
                        img = `https://media.kahoot.it/${a.questions[i].image.id}`;
                    } else {
                        console.warn('Cannot find any image for question.');
                    }
                }
                if (a.questions[i].type === "content") {
                    quiz.content++;
                }
                if (a.questions[i].type === "quiz" || a.questions[i].type === "multiple_select_quiz" || a.questions[i].type === "jumble" || a.questions[i].type === "open_ended") {
                    found++;
                    for (let j = 0; j < (a.questions[i].choices).length; j++) {
                        if (a.questions[i].choices[j].correct.toString() == "true") {
                            if (a.questions[i].choices[j].answer) {
                                q.answer.push(`${a.questions[i].choices[j].answer}`);
                            } else {
                                if (a.questions[i].choices[j].image.id) {
                                    q.answer.push(a.questions[i].choices[j].image.id);
                                }
                            }
                        }
                    }
                    if (img != "") {
                        consoleimg.load(img);
                    } else {
                        consoleimg.load('https://i.imgur.com/DryHey4.png');
                    }
                    //console.error(`%cThere was a problem with getting answers to the question: ${q.question}`, "color:orange")
                    console.log('%c-----------------', "color:purple");
                    console.log(`%cQuestion: ${q.question}`, "color:#d392fc");
                    console.log(`%c[${q.answer.length}] Answer${getLength(q.answer)}: ${q.answer.join('  &  ')}`, "color:#fc92f0");
                    console.log(`Question info: ${(a.questions[i].choices).length} choices, ${a.questions[i].time / 1000} seconds, ${a.questions[i].pointsMultiplier}x points multiplier`);
                    dataPush = { "question": `${q.question}`, "answers": `${q.answer.join('  &  ')}` };
                    data.push(dataPush);
                } else {
                    if (a.questions[i].type != "content") {
                        console.warn(`%cQuestion: "${q.question}" has a question type that is unsupported yet and has been skipped. Contact me: nattawatt#8556 and give me a link to the quiz so I can add a question type to the cheat`)
                    }
                }
            }
            time.end = Date.now();
            quiz.found = found;
            quiz.questions = k;
            return quiz;
        })
        .then((quiz) => {
            return `Got answers for ${quiz.found}/${quiz.questions - quiz.content} questions.\nTime to get answers: ${(time.end - time.start) / 100 }s.\nSelected quiz: "${quiz.title}" created by ${quiz.author}.`;
        })
        .then((data) => {
            setTimeout(() => {
                console.log(data);
                console.log(`%cYou can use CTRL + F to find the current question`, "color:#d392fc");
                alert(data);
            }, 1000 * 1);
        }).then(() => {
            let plain = "";
            for (let i = 0; i < data.length; i++) {
                plain = `Question: ${data[i].question}\nAnswer: ${data[i].answers}`;
            }
        })
}
console.clear();
console.log('%cScript created by RealNattawattHongthong', "color:#ff66ff");
console.log('Cheat is under GNU General Public License v3.0.\nGithub repo: https://github.com/RealNattawattHongthong/kahoot-cheat/');
console.log('Join my Discord to get access search quizzes using quiz name!\nhttps://dsc.gg/elekcje');
(function getUserInput(reason) {
    let userInput = prompt(`${reason}\nEnter the last part of link, that's visible on the teacher's screen.\n\nFor example: https://play.kahoot.it/v2/lobby?quizId= \"4487beab-3d31-4e9e-8d94-94ef15f87230\"\nor\nhttps://kahoot.it/challenge/ \"0ad1597f-7b0c-4d3c-bbfd-96b75865a98d_1623430352655\"`);
    if (userInput != "") {
        console.log(`%cTrying to fetch \"${userInput}\"`, "color:#d392fc");
        fetch(`https://kahoot.it/rest/kahoots/${userInput}`)
            .then((r) => {
                if (!r.ok) {
                    fetch(`https://kahoot.it/rest/challenges/${userInput}/answers`)
                        .then((res) => {
                            if (!res.ok) {
                                console.log(`%cWrrr, can't find the quiz by id: ${userInput}! Try again!`, "color:red");
                                alert(`Wrrr, can't find the quiz by id: ${userInput}! Try again!`);
                                getUserInput("Error: Invalid quizID");
                            } else {
                                return res.json()
                            }
                        })
                        .then((res) => {
                            if (res.answers[1].quizId) {
                                console.log(`%cHAHAHA, kahoot sucks so I found the answers for you!`, "color:#63ff68");
                                alert(`HAHAHA, kahoot sucks so I found the answers for you!`);
                                getQuizid(res.answers[1].quizId);
                            } else {
                                console.log(`%cWrrr, can't find the quiz by id: ${userInput}! Try again!`, "color:red");
                                alert(`Wrrr, can't find the quiz by id: ${userInput}! Try again!`);
                                getUserInput("Error: Invalid quizID");
                            }
                        })
                } else {
                    console.log(`%cHAHAHA, kahoot sucks so I found the answers for you!`, "color:#63ff68");
                    alert(`HAHAHA, kahoot sucks so I found the answers for you!`);
                    getQuizid(userInput);
                }
            });
    } else {
        console.log(`%cInput can't be empty!`, "color:#ff5252");
        getUserInput("Error: Empty input");
    }
})();

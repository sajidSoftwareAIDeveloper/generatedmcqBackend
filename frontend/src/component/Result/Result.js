
import './Result.css'
import '../Question/Question.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
export const Result=()=>{

    const[data,setData]=useState({questions:[[]],options:[[]],answers:[[]],explanations:[[]]});
    const[selectedAnswer,setSelectedAnswer]=useState([]);
    const navigate=useNavigate();
    const[scores,setScores]=useState({score:0,total:0});

    // const data1={
    //     question:[['what is  the +++++++++++gygb gyf r+++++++++++++++++++++++++++++++ one +1','what is the 2+2','what is the 2+2'],['what is the one +1','what is the 2+2','what is the 2+2']],
    //     answer:[[1,3,2],[4,2,1]],
    //     option:[[[1,2,3,4],[1,2,3,4],[1,2,3,4]],[[1,2,3,4],[1,2,3,4],[1,2,3,4]]],
    //     explain:[['a','b','c'],['a','b','c']],

    // }

    useEffect(()=>{
        setData(JSON.parse(localStorage.getItem('data')));
        // console.log('+++', JSON.parse(localStorage.getItem('answer')))
        const info= JSON.parse(localStorage.getItem('answer'));
        setSelectedAnswer(info)
        const score = info.reduce((acc, item) => acc + item[3], 0);
        const total=info.length;
        setScores({score,total});
        // console.log(score,total)

    },[])

    

    return (
      <div className="question-main">
        {data.questions[0].length === 0 ? (
          <div className="not-found">data not availabel</div>
        ) : (
          <div>
            <div className="score-board">
              <div>score</div>
              <div>
                {scores.score}/{scores.total}
              </div>
              <div> {((scores.score / scores.total) * 100).toFixed(2)}%</div>
            </div>
            {data.questions.lenght !== 0 &&
              data.questions.map((items, indexs) =>
                data.questions[indexs].map((item, index) => (
                  <div className="questions" key={indexs + "" + index}>
                    <div className="question">
                        <div>{index + 1 + items.length * indexs}.</div>
                        <div> {item}</div>
                    </div>
                    <div className="options">
                      {data.options[indexs][index].map((i, idx) => (
                        <div
                          className={
                            selectedAnswer.find(
                              (item) =>
                                item[0] === indexs &&
                                item[1] === index &&
                                item[2] === idx
                            ) ||
                            data.answers[indexs][index] ===
                              data.options[indexs][index][idx]
                              ? data.answers[indexs][index] ===
                                data.options[indexs][index][idx]
                                ? "selected-option"
                                : "wrong-option"
                              : "result-option"
                          }
                          key={indexs + "" + index + "" + idx}
                        >
                          {i}
                        </div>
                      ))}
                    </div>

                    <div className="explain">
                      Explain : {data.explanations[indexs][index]}
                    </div>
                  </div>
                ))
              )}
            <div className="file-submit">
              <button
                className="submit-button"
                onClick={() => {
                  navigate("/");
                }}
              >
                home
              </button>
            </div>
          </div>
        )}
      </div>
    );
}
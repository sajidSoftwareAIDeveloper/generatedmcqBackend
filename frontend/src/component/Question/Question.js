
import { useEffect, useState } from 'react'
import './Question.css'
import { useNavigate } from 'react-router';

export const Question=()=>{

    const[data,setData]=useState({questions:[[]],options:[[]],answers:[[]],explanations:[[]]});
    const[selectedAnswer,setSelectedAnswer]=useState([]);
    const[isValid,setIsValid]=useState(false);

    const navigate=useNavigate();

    // const data1={
    //     question:[['what is the one +1','what is the 2+2','what is the 2+2'],['what is the one +1','what is the 2+2','what is the 2+2']],
    //     answer:[[1,3,2],[4,2,1]],
    //     option:[[[1,2,3,4],[1,2,3,4],[1,2,3,4]],[[1,2,3,4],[1,2,3,4],[1,2,3,4]]],
    //     // explain:['a','b'],

    // }

    useEffect(()=>{
        // console.log(JSON.parse(localStorage.getItem('data')));
        setData( JSON.parse(localStorage.getItem('data')));
    },[]);

    
    function selectedAnswerHandle(pos){

        if(selectedAnswer.length!==0){
            // setSelectedAnswer(prev =>
            //     prev.some(item => (item[0]=== pos[0] && item[1]=== pos[1]) )
            //       ? prev.map(item => (item[0]=== pos[0] && item[1]=== pos[1] && item[2] === pos[2])? item : pos) // replace
            //       : [...prev, pos] // add if not found
            //   );

            setSelectedAnswer(prev => {
                const index = prev.findIndex(
                  item => item[0] === pos[0] && item[1] === pos[1]
                );
              
                if (index !== -1) {
                  // Replace the matched item with pos, but not all items
                  return prev.map((item, i) =>
                    i === index ? (item[2] === pos[2] ? item : pos) : item
                  );
                } else {
                  // No match — add pos
                  return [...prev, pos];
                }
              });
              

        }else{
            setSelectedAnswer([pos]);
        }
    }

    function questionSubmitHandle(){
        // alert(55)
        if(selectedAnswer.length!==data.questions.flat().length){
            setIsValid(true);
            setTimeout(()=>{
                setIsValid(false);
            },[2000])
        }else{
            localStorage.setItem("answer",JSON.stringify(selectedAnswer));
            // console.log(selectedAnswer)
            navigate('/result');
        }

    }
    return(
        <div className='question-main'>
           
            
            {
                data.questions.length===0
                &&
                <div className='not-found'>data not availabel</div>
            }

            {
                isValid &&
                <div className="message">
                     <h1 className='smassageValue'>please complete all questions</h1>
                </div>
            }
            {
                data.questions.lenght!==0
                &&
                data.questions.map((items,indexs)=>(
                    items.map((item,index)=>(
                        <div className='questions' key={indexs+""+index}>
                            <div className='question'>{(index+1+((items.length)*indexs))}. {item}</div>
                            <div className='options'>
                                {
                                    data.options[indexs][index].map((i,idx)=>(
                                        <div 
                                        className={
                                            selectedAnswer.find(item => item[0] === indexs && item[1] === index && item[2] === idx ) 
                                            ?'select-option':'option'
                                            }
                                        onClick={()=>selectedAnswerHandle([indexs,index,idx,i===data.answers[indexs][index]?1:0])} 
                                        key={indexs+""+index+""+idx}>{i}
                                        </div>
                                     ))
                                }
                            </div> 
                        </div>
                    ))
                ))
            }
            {
               data.questions.lenght!==0
               &&
                <div className='file-submit'>
                     <button className='submit-button' onClick={questionSubmitHandle}>submit</button>
                </div>
            }

        </div>
    )
}
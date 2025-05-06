
import { useRef, useState } from 'react';
import './Home.css'
import { useNavigate } from 'react-router';
import { Loading } from '../Loading/Loading';

export const Home=()=>{

    const fileInputRef = useRef(null);
    const[IsTextOpen,setIsTextOpen]=useState(false);
    const[files,setFiles]=useState(null);
    const[textData,setTextData]=useState('');
    const[isLoading,setIsLoading]=useState(false);
    const[isGenerate,setIsGenerate]=useState(false);

    const navigate=useNavigate();



    const fileHandle = () => {
      fileInputRef.current.click(); // trigger file input click
      setIsGenerate(false);
    };


    function validateFiles(e) {
        const selectedFiles = Array.from(e.target.files);
        // let docCount = 0;
        // console.log(selectedFiles[0].name);
    
        // for (let file of selectedFiles[0].name) {
        //     const type = file.type;
        //     // Allow only image, PDF, DOCX
        //     if (
        //         !type.startsWith("image/") &&
        //         type !== "application/pdf" &&
        //         type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        //     ) {
        //         alert(`Unsupported file type: ${type}`);
        //         return;
        //     }
    
        //     // Count PDFs/DOCX
        //     if (type === "application/pdf" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        //         docCount++;
        //         if (docCount > 1) {
        //             alert("Only one document (PDF/DOCX) is allowed.");
        //             return;
        //         }
        //     }
        // }
    
        setFiles(selectedFiles[0]);
        setIsTextOpen(false)
    }

    function textHandle(){
        const formData = new FormData();
        // setTextData(textData!==null ?textData.trim():null);
        // console.log(textData.trim());
        const data=textData.trim();
        if(data.length>=30){
            formData.append('text',data.trim());
            dataUploading(formData);
            // for (let pair of formData.entries()) {
            //     console.log(pair[0], pair[1]);
            //   }
        }else{
            alert('please enter valid data greather than 30 charectors');
        }
    }

    function fileSubmitHandle(){
        const formData = new FormData();
        if(files!==null){
            // console.log(files);
            formData.append('file',files);
            // console.log(formData);
            // for (let pair of formData.entries()) {
            //     console.log(pair[0], pair[1]);
            //   }
              
            dataUploading(formData);
        }
    }

    async function dataUploading(formData){
        setIsLoading(!isLoading);

        try {
            const res = await fetch("http://127.0.0.1:8000/upload/", {
              method: "POST",
              body:formData,
            });
      
            if (!res.ok) {
              const err = await res.json();
              setIsLoading(!isLoading);

              throw new Error(err.error || "Upload failed");
            }
      
            const data = await res.json();
            if(data){
                setIsLoading(!isLoading);
                localStorage.setItem('data',JSON.stringify(data.message))
                navigate('/question');
                // console.log(data);
            }else{
                setIsGenerate(true);
                setFiles('');
                IsTextOpen(false);
            }
            
            // alert("Upload successful: " + JSON.stringify(data));
          } catch (err) {
            setIsLoading(!isLoading);
            alert("uploading failed:" + err.message);
          }
    }

    return(
        <div className='home-main'>

            {
                isGenerate 
                &&
                <div className='isgeneratedq'>not genaretd question because your information is not generatabel</div>
            }

            <div className='select-images'>
                <div>
                    <button onClick={()=>{setIsTextOpen(!IsTextOpen);setFiles(null);setIsGenerate(false)}}>  <img className="text" src="text.png" alt="text" />  </button>
                </div>

                <div>
                    <button onClick={fileHandle}><img className="file" src="fileIcon.png" alt="file"/> </button>
                    <input
                        type="file"
                        accept="image/*,.pdf,.docx"
                        // multiple
                        ref={fileInputRef}
                        onChange={validateFiles}
                        style={{ display: "none" }}
                    />
                </div>
            </div>

            {
                files!==null 
                &&
                <div className='slected-file'>
                    <div>
                        <h1> selected file</h1>
                        <h2>{files.name}</h2>
                    </div>
                    <div className='file-submit'>
                        <button className='submit-button' onClick={fileSubmitHandle}>submit</button>
                    </div>
                </div>

            }

            {
                IsTextOpen===true  
                &&
                <div className='text-data'>
                    <div>
                        {/* <p></p> */}
                       <textarea
                            type='text'
                            className='textarea-field'
                            onChange={(e)=>setTextData(e.target.value)}
                       />
                    </div>
                    <div className='file-submit'>
                        <button className='submit-button' onClick={textHandle}>submit</button>
                    </div>
                </div>
            }

            {
                isLoading 
                &&
                <Loading/>
            }

        </div>
    )
}
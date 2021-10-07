import React,{Suspense, useState} from 'react';
import {storage,DataBase} from '../firebase';
import firebase from 'firebase';
import {Button, IconButton, Input, Modal,TextField} from '@material-ui/core';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import LinearProgress from '@material-ui/core/LinearProgress'
import {useStateValue} from '../../contexts/StateProvider'
import './CreateEvent.css'
import AlertDialog from '../AlertDialog'
import Skeleton from '@material-ui/lab/Skeleton';
const DateTimeSelect = React.lazy(()=>import('../DateTimeSelect')) 

function CreateEvent() {
    //get the user from the provider
    const [{user}, dispatch] = useStateValue();
    //description
    const [description,setDescription] = useState('');
    //image 
    const [imageThumbnail,setImageThumbnail] = useState(false);
    //progress bar
    const [progress,setProgress] = useState(0); 
    //open the modal 
    const [openProgress,setOpenProgress] = useState(false)
    //title 
    const [title,setTitle] = useState('')
    //venue/link
    const [venue,setVenue] = useState('')
    //Datetime
    const [dateTime,setdateTime] = useState(new Date())
    //open alert box when a new event is created
    const [openAlert,setOpenAlert] = useState(false)

    console.log(openAlert)
    //get the name of the first image file you selected (image as a file)
    const handleImageChange = (e) =>{
        if (e.target.files[0]){
            setImageThumbnail(e.target.files[0]);
        }
    }
    const handleUpload = () =>{
  //=============================={Upload the image to firebase database}========================
            if (imageThumbnail) {
            
            //Access the storage and upolad the image in the 'eventThumbnails' folder and give it the name =image.name
            const uploadTask = storage.ref(`eventThumbnails/${imageThumbnail.name}`).put(imageThumbnail)
        
            //listen to changes in the state of the upload
            uploadTask.on(
                "state_changed",
                //keep track of the progress and give a snapshot each time
                (snapshot) =>{

                    //a number between 0 to 100 is stored in progress_ to keep track of the progress
                    const progress_ = Math.round(
                        (snapshot.bytesTransferred/snapshot.totalBytes)*100
                    );
                    setOpenProgress(true)
                    setProgress(progress_)
                },
                //catch the error
                (error) => {
                    //because the error is not user friendly just log it to the console
                    console.log(error)
                    //show the error message
                    alert(error.message)
                }, 

//===================={get the uploaded image from the firebase database}========================

                () => {
                    storage
                    //access the 'eventThumbnails' folder in the storage
                    .ref('eventThumbnails')
                    //get the name of the image file
                    .child(imageThumbnail.name)
                    //get the url to download the image
                    .getDownloadURL()
                    //add the image to the 'posts' folder of the database
                    .then((url)=>{
                        DataBase.collection('events').add({
                            //set the attribute to the time stamp of the server which serves the file
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            //set title
                                title:title,
                            //set date amd time
                                dateTime:dateTime,
                            //set venue
                                venue:venue,
                            //set the description attribute to the description user entered   
                                description:description,
                            //set image url attribute to the 'url' we got from the getDownloadURL() method
                                imageUrl:url,
                            //get the username as a prop from the 'App.js' file
                                username:user.displayName,
                            //post the id of the user from 'user' object  
                                user_id:user.uid,
                            //initially set interestedCount to 0 
                                interestedCount:0
                            })
                            //once done set clear the input c
                            setProgress(0);
                            setOpenProgress(false)
                            setTitle("")
                            setDescription("");
                            setVenue("")
                            setImageThumbnail(null)
                            
                            
                            
                            

                    })
                    setOpenAlert(true)

                }

            )
    }
    else{
        alert("No image selected")
    }
}

    return (
        <div className="createEventWrapper">
            <h2 id="createEvent_h2"> CREATE EVENT </h2>
        <div className="createEvent">
                                                         

                                                        {/*Modal for progress of upload*/}
                <Modal  imageUpload__progressModal="createEvent__progressModal" open={openProgress} onClose={()=>{setOpenProgress(false)}}> 
                                                                        {/*progress bar*/}
                        <LinearProgress  variant="determinate" className="createEvent__uploadProgress" value={progress} max="100"/>
                </Modal>
                <AlertDialog text={"Your new event is up!"} openAlert={openAlert} changeAlert={al=>{setOpenAlert(al)}}/>

                                                        {/*post upload form */}
            <div className="createEvent_formContainer">
                <form className="createEvent__form" onSubmit={(e)=>{e.preventDefault()}}>
                        {/*input the image and caption from the user*/}
                        <Input style={{color:"aliceblue"}}  className="createEvent__title" type="text" placeholder="Enter a the name for the event..." onChange={(e)=>setTitle(e.target.value)} value={title}/>
                        {/*if image is selected then show selected else show choose an image*/}
                        <input className="createEvent__fileInput" accept="image/*"  id="imageThumbnail-button-file" type="file" onChange={handleImageChange} />
                        <label htmlFor="imageThumbnail-button-file" style={{color:"gray"}}>
                            <IconButton color="primary" aria-label="upload thumbnail" component="span">
                                <AddPhotoAlternateIcon /> 
                            </IconButton>
                            {imageThumbnail?"Image selected":"Choose a thumnail image"}
                        </label>  
                        {imageThumbnail&&(<img width="100px" height="100px" src={URL.createObjectURL(imageThumbnail)}/>)}
                        {/*change the 'dateTime' from the <DateTimeSelect/> component*/}
                        <Suspense fallback={
                            <div><Skeleton variant="text" />
                            <Skeleton variant="circle" width={40} height={40} />
                            <Skeleton variant="rect" width={210} height={118} /></div>} >
                                <DateTimeSelect changeDate={dateTime => setdateTime(dateTime)} dateTime={dateTime}/>
                            </Suspense>                                            
                        <TextField placeholder="Enter a decription..." className = "createEvent__textarea" onChange={(e)=>setDescription(e.target.value)} value={description}
                            id="outlined-multiline-static"
                            label="Multiline description"
                            multiline
                            rows={4}
                            defaultValue="Default Value"
                            variant="outlined"
                            />
                        <Input style={{color:"aliceblue"}}  className="createEvent__venue" type="text" placeholder="Enter a Venue/Link..." onChange={(e)=>setVenue(e.target.value)} value={venue}/>
                        <Button className="createEvent___iButton" disabled = {!imageThumbnail} variant ='contained' color="primary" type ='submit' onClick={handleUpload}>Create the event</Button>
                </form>
           </div>
        </div>
    </div>
    )
}

export default CreateEvent;


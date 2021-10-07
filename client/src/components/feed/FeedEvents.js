import React, { useEffect, useState } from 'react'
import {DataBase} from '../firebase'
import {useStateValue} from '../../contexts/StateProvider'
import './FeedEvents.css'
import { Suspense } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'

const Event = React.lazy(()=>import('../events/Event'))
function FeedEvents() {

//get the user from the provider
const [{user}, dispatch] = useStateValue();
//events array
const [events, setEvents] = useState([]);
//====================================Events changes listner=========================================
    useEffect( () => {
        //onSnapshot = listner to changes in posts 
        //everytime the posts change run this code
        //grab the collection 'events' from the database and order 'docs' in the collection by timestamp
        DataBase.collection('events').orderBy('timestamp','desc').onSnapshot(snapshot =>{
        //Now set the  id=doc.id and event=doc.data to the fields in the 'event' variable that we defined above
        console.log(snapshot.docs.map(doc =>({id:doc.id,event:doc.data()})))
        setEvents(snapshot.docs.map(doc =>({id:doc.id,event:doc.data()})))
            })
    
        return 

    
    },[user]);
    return (
    <div className="feedEvents">
            <div className="feedEvents__events"> 
                 {
                //render only those posts by id who are newly added to the database dont render the entire post list  
                events.map(({id,event})=>(
                    <Suspense fallback={
                        <div><Skeleton variant="text" />
                        <Skeleton variant="circle" width={40} height={40} />
                        <Skeleton variant="rect" width={210} height={118} /></div>} key={id}>
                            <Event key={event.id} eventId={id} dateTime={event.dateTime} venue={event.venue} title={event.title} username={event.username} user_id={event.user_id} description={event.description} imageUrl={event.imageUrl} interestedCount={event.interestedCount}/>
                    </Suspense>
                ))
                } 
            </div>    
    </div>
    )
}

export default FeedEvents

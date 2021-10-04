import { Card, CardContent, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { DataBase } from '../firebase';
import './client/YourEvents.css'

function UserEvents({palId}) {
    //store user's events
    const [events,setEvents] = useState([])
    //convert date
    const convertToDate = (date) => {
        //convert to miliseconds
        let k = date.seconds*1000
        let dat = Date(k)
        dat = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: "long" ,day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(k)
        return dat
    }
    //====================================GET user created events=========================================
    useEffect( () => {
        //grab the events which belong to the logged in user from the db
        DataBase.collection('events').where("user_id", "==", palId).get()
        .then((querySnapshot) => {
            setEvents(querySnapshot.docs.map(doc =>doc.data()))
            console.log(events)
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
        
    },[,palId]);
    return (
        <div className="yourevents">
            {events.length!=0?(events.map(event=>(
                    <Card className="yourevents__event" key={event.id}>
                        <CardContent className="yourevents__eventContent">
                            <Typography  component={'span'}>Event: {event.title}</Typography>
                            <Typography  component={'span'}>Date: {convertToDate(event.dateTime)}</Typography>
                            <Typography  component={'span'}>Venue: {event.venue}</Typography>
                            <Typography  component={'span'}>Interested people: {event.interestedCount}</Typography>
                        </CardContent>
                    </Card>
            ))):(<h4 style={{color:'aliceblue'}}>Empty.Just like this tab.</h4>)}
        </div>
    )
}

export default UserEvents

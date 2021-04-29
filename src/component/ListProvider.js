import React, { useState } from "react";
import ListContext from "../contexts/listContext";

const ListProvider = ({children}) =>{
    const setTopicName = (newTopic) =>{
        // console.log('newTopic: ',newTopic)
        // setTopics(newTopic);
        setTopicNames(prevState => {
            return {
              ...prevState,
              topicName: newTopic
            };
          });
    }
    const initstate = {
        topicName:'',
        setTopicName
    };
    const [topicName,setTopicNames] = useState(initstate);
    return(
        <ListContext.Provider  value={topicName}>
            {children}
        </ListContext.Provider >
    )
}
export default ListProvider;
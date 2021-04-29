import { List } from "rc-field-form";
import { createContext } from "react";

const ListContext = createContext({
    topicName:'',
    setTopicName:()=>{}
})
export default ListContext;
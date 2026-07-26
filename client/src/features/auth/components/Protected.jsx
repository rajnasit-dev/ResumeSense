import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";

const Protected = ({children}) => {
    const { loading,user } = useAuth()
    if(loading){
        return <LoadingSkeleton label="Loading workspace" />
    }
    if(!user){
        return <Navigate to={'/login'} />
    }
    return children
}

export default Protected

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Children } from "react";

function ProtectedRoute( {chikdreb}){
    const { user, loading} = useAuth()

    if (loading) return <p>Cargando...</p>

    if (!user) return <Navigate to ="/login"/>

    return Children
}


export default ProtectedRoute
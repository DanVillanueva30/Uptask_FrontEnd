import { getTaskById } from "@/api/TaskAPI";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation, useParams } from "react-router-dom"
import EditTaskModal from "./EditTaskModal";


export default function EditTaskData() {
    const params = useParams();
    const projectId = params.projectId!;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('editTask')!;

    const { data, isError } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({projectId, taskId}),
        //El param enabled es necesario para que no se realice la consulta si no exite el param ?editTask en la URL.
        enabled: !!taskId,  // <-- La doble exclamación convierte el taskId en boolean, si existe retorna true y sino false.
        retry: false
    })

    if(isError) return <Navigate to={'/404'}/>
    if(data) return (
        <EditTaskModal data={data} taskId={taskId}/>
    )
}

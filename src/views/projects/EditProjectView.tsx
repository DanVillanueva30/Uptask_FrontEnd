import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/api/ProjectAPI";
import EditProjectForm from "@/components/projects/EditProjectForm";


export default function EditProjectView() {
    const params = useParams();
    const projectId = params.projectId!

    const { data, isLoading, isError } = useQuery({
        //Se le pasa el projectId de la URL en query ya que como se pueden tener varios proyectos activos el queryKey va a ser el mismo para todos, por lo cual la consulta se haría siempre al primer proyecto al que se dio click por ejemplo si se dio click en el proyecto con el id 1 este siempre hará la consulta a ese projecto, al pasar el ID de cada proyecto como segundo parámetro las consultas si serán diferentes cada vez.
        queryKey: ['editProject', projectId],
        queryFn: () => getProjectById(projectId),
        retry: false // <-- Desactiva el volver a intentar la consulta si la primera vez falla.
    })

    if(isLoading) return 'Cargando...';
    if(isError) return <Navigate to="/404"/>
    if(data) return (
        <EditProjectForm data={data} projectId={projectId} />
    )
}

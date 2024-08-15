import { Project, TaskProject, TaskStatus } from "@/types/index"
import TaskCard from "./TaskCard";
import { statusTranslations } from "@/locales/es";
import DropTask from "./DropTask";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatus } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

type TaskListProps = {
    tasks: TaskProject[];
    canEdit: boolean;
}

type groupedTasks = {
    [key: string]: TaskProject[];
}

const initialStatusGroups : groupedTasks = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: [],
}

const statusStyles : { [key: string]: string } = {
    pending: 'border-t-slate-500',
    onHold: 'border-t-red-500',
    inProgress: 'border-t-blue-500',
    underReview: 'border-t-amber-500',
    completed: 'border-t-emerald-500',
}


export default function TaskList({tasks, canEdit}: TaskListProps) {

    const params = useParams();
    const projectId = params.projectId!;
    const queryClient = useQueryClient();

    const {mutate} = useMutation({
        mutationFn: updateStatus,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({queryKey: ['projectId', projectId]}); //Al momento de arrastrar una tarea hacia un nu7evo estado hace un re-fetch al proyecto para mostrar en tiempo real los cambios realizados.
        }
    })

    //Genera los diferentes "contenedores" de tareas y las agrupa en el estado de estas.
    const groupedTasks = tasks.reduce((acc, task) => {
        //Si existe una tarea se genera un contenedor con el estado de esta tarea, sino se crea un arreglo vacío.
        let currentGroup = acc[task.status] ? [...acc[task.status]] : []; 
        currentGroup = [...currentGroup, task] //Tama una copia del "contenedor" y le agrega la tarea tarea correspondiente.
        return { ...acc, [task.status]: currentGroup };//Retorna un objeto con todos los contenedores y sus tareas correspondientes,
    }, initialStatusGroups );

    const handleDragEnd = (e: DragEndEvent) => {
        const { over, active } = e;
        if(over && over.id) {
            const taskId = active.id.toString();
            const status = over.id as TaskStatus;
            mutate({projectId, taskId, status});

            //Se utiliza setQueryData para actualizar de forma optimista el cambio de estado de una tarea ya que tarda un poco en hacer el cambios con setQueryData se realiza de forma manual y anticipada ANTES de que se realize el llamado a a la API.
            queryClient.setQueryData(['projectId', projectId], (prevData: Project) => {
                const updatedTasks =  prevData.tasks.map((task) => {
                    //Localizar la tarea a la que se le está cambiando el estado.
                    if(task._id === taskId) {
                        return { //retorna una copia de la tarea, y se le cambia el estado
                            ...task,
                            status
                        }
                    }
                    return task //Se retornan los datos que no han sido cambiados para no perderlos.
                })
                return {//Estos se convierten en los "nuevos" datos previos pero ya con la actualización de estado de la tarea
                    ...prevData,
                    tasks: updatedTasks
                }
            });
        }
    }
    return (
        <>
            <h2 className="text-5xl font-black my-10">Tareas</h2>

            <div className='flex flex-col lg:flex-row gap-5 overflow-x-scroll xl:overflow-auto pb-32'>
                <DndContext onDragEnd={handleDragEnd}>
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div key={status} className='min-w-[300px] xl:min-w-0 xl:w-1/5'>
                            <h3 
                                className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 
                                border-t-8 ${statusStyles[status]}`}
                            >{statusTranslations[status]}</h3>
                            <DropTask status={status}/>
                            <ul className='mt-5 space-y-5'>
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                                ) : (
                                    tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit}/>)
                                )}
                            </ul>
                        </div>
                    ))}
                </DndContext>
            </div>
        </>
    )
}

import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TaskForm from './TaskForm';
import { TaskFormData } from '@/types/index';
import { createTask } from '@/api/TaskAPI';
import { toast } from 'react-toastify';

export default function AddTaskModal() {

    const navigate = useNavigate();
    //Mediante la url se busca y valida que se ecuentre el parámetro "newTask" para que se abra el modal de nueva tarea.
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const modalTask = queryParams.get('newTask');
    const showModal = modalTask ? true : false;

    /**Obtener el projectId */
    const params = useParams();
    const projectId = params.projectId!

    const initialValues : TaskFormData = {
        name: "",
        description: ""
    }
    const { register, handleSubmit, reset, formState: { errors } } = useForm({defaultValues: initialValues});

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createTask,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            //Una vez creada una nueva tarea vuelve a obtener el proyecto y sus tareas actualizadas.
            queryClient.invalidateQueries({ queryKey: ['projectId', projectId] });
            toast.success(data);
            reset(); // <-- Reinicia el formulario y valores.
            navigate(location.pathname, {replace: true}); //Cierra el modal y elimina el param newTast de la URL.
        }
    });

    const handleCreateTask = (formData: TaskFormData) => {
        const data = {
            formData,
            projectId
        }
        mutate(data);
    }
    /**
         navigate( location.pathname, {replace: true} <-- Redirige a la misma pagina y elimina el parámetro "newTask" de la URL.
    **/ 
    return (
        <>
            <Transition appear show={showModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate( location.pathname, {replace: true})}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <DialogTitle
                                        as="h3"
                                        className="font-black text-4xl  my-5"
                                    >
                                        Nueva Tarea
                                    </DialogTitle>

                                    <p className="text-xl font-bold">Llena el formulario y crea  {''}
                                        <span className="text-fuchsia-600">una tarea</span>
                                    </p>
                                    
                                    <form
                                        className="mt-10 space-y-3"
                                        onSubmit={handleSubmit(handleCreateTask)}
                                        noValidate
                                    >
                                        <TaskForm  register={register} errors={errors} />
                                        <input 
                                            type="submit" 
                                            value="Guardar tarea" 
                                            className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer 
                                            transition-colors"
                                        />
                                    </form>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
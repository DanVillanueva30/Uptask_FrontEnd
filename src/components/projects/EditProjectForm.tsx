import { Link, useNavigate } from 'react-router-dom';
import ProjectForm from './ProjectForm';
import { Project, ProjectFormData } from '@/types/index';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProject } from '@/api/ProjectAPI';
import { toast } from 'react-toastify';


type EditProjectFormProps = {
    data: ProjectFormData;
    projectId: Project['_id'];
}

export default function EditProjectForm( { data, projectId } : EditProjectFormProps) {

    const navigate = useNavigate();
    const { register, handleSubmit, formState: {errors} } = useForm({defaultValues: {
        projectName: data.projectName,
        clientName: data.clientName,
        description: data.description
    }});
    

    const queryClient = useQueryClient(); // Hook para actualizar el state de react-query
    const { mutate } = useMutation({
        mutationFn: updateProject,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {  
            //hace una nueva consulta para obtener los datos actualizados después de editar un proyecto así se actualiza el state de manera correcta.
            queryClient.invalidateQueries({queryKey: ['projects']}); 
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]});
            toast.success(data);
            navigate('/');
        }
    });

    const handleForm = (formData: ProjectFormData) => {
        //Para poder actualizar un proyecto se necesita el ID para identificar cual proyecto se va a ctualizar y la información del formulario, por eso se crea un objeto con ambos parámetros.
        const data = {
            formData,
            projectId
        }

        mutate(data); // <-- Solo se le puede pasar un parámetro.
    }

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-black">Editar Proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para editar el proyecto</p>
                <nav className="my-10">
                    <Link
                        className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl fornt-bold cursor-pointer
                        transition-colors"
                        to="/"
                    > Volver a Proyectos </Link>
                </nav>

                <form
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >
                    <ProjectForm register={register} errors={errors} />
                    <input 
                        type="submit" 
                        value="Guardar cambios" 
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer 
                        transition-colors"
                    />
                </form>
            </div>
        </>
    )
}

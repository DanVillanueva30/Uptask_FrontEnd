import { deleteNote } from "@/api/NoteAPI";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/index"
import { formatDate } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

type NoteDetailProps = {
    note: Note;
}

export default function NoteDetail({note}: NoteDetailProps) {
    const params = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const projectId = params.projectId!;
    const taskId = queryParams.get('viewTask')!;

    const {data, isLoading} = useAuth();
    const canDelete = useMemo(() => data?._id === note.createdBy._id , [data?._id, note.createdBy._id]);

    const queryClient = useQueryClient();
    const {mutate} = useMutation({
        mutationFn: deleteNote,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({queryKey: ['task', taskId]});
        }
    });

    const handleDeleteNote = () => {
        mutate({projectId, taskId, noteId: note._id})
    }
    if(isLoading) return 'Cargando...';
    return (
        <div className="p-3 flex justify-between items-center">
            <div>
                <p className="font-bold">
                    Por {note.createdBy.name}: <span className="font-normal">{note.content}</span>
                </p>
                <p className="text-xs text-slate-500">
                    {formatDate(note.createdAt)}
                </p>
            </div>
            {canDelete && (
                <button 
                    type="button"
                    className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors"
                    onClick={handleDeleteNote}
                >Eliminar</button>
            )}
        </div>
    )
}

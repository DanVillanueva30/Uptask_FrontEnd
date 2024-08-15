
import api from "@/lib/axios";
import { dashboardProjectSchema, editProjectSchema, Project, ProjectFormData, projectSchema } from "../types";
import { isAxiosError } from "axios";


type ProjectAPIType = {
    formData: ProjectFormData,
    projectId: Project['_id'];
}


export async function createProject(formData: ProjectFormData) {
    try {
        const { data } = await api.post('/projects', formData);
        return data;
    } catch (error) {
        //Se tipa el error del catch con la función isAxiosError y se evalua si exite un error en la respuesta
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error); //Se retorna el error que viene desde el servidor para poder hacerlo visible con useMutation y onError.
        }
    }
}

export async function getProjects() {
    try {
        const { data } = await api.get('/projects');
        const response = dashboardProjectSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function getProjectById(id: Project['_id']) {
    try {
        const { data } = await api.get(`/projects/${id}`);
        const response = editProjectSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function getFullProject(id: Project['_id']) {
    try {
        const { data } = await api.get(`/projects/${id}`);
        const response = projectSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function updateProject({ formData, projectId }: ProjectAPIType) {
    try {
        const { data } = await api.put<string>(`/projects/${projectId}`, formData);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function deleteProject(id: Project['_id']) {
    try {
        const { data } = await api.delete<string>(`/projects/${id}`);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}
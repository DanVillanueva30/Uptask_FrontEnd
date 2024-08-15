import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/AuthAPI";

export const useAuth = () => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: false,
        refetchOnWindowFocus: false //Evita que haga una nueva consulta cada que se cambie de pestaña en el navegador.
    });

    return { data, isError, isLoading }
}
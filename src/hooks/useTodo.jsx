import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";


const useTodo = () => {
    const {user} = useAuth();
    const axiosPublic = useAxiosPublic();
    const { data: userTasks = [], refetch, isPending, isError, error } = useQuery({
        queryKey: ['trainers'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/tasks/${user.email}`);
            return res.data;
        },
        // refetchInterval: 100,
    })
    return [userTasks, refetch, isPending, isError, error]
};

export default useTodo;
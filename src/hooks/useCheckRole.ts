import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";


const UseCheckRole = () => {
    const users = useSelector((state: RootState) => state.users);
    return {
        role : users?.user?.role?.id
    }
}

export default UseCheckRole
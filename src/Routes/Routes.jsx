import {
    createBrowserRouter,

} from "react-router-dom";
import BMI from "../BMI/BMI";


const router = createBrowserRouter([
    {
        path: "/",
        element: <BMI></BMI>,
    },
]);

export default router;
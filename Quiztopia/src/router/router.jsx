import { createBrowserRouter } from 'react-router-dom'
import SignIn from '../SignIn'
import SignUp from '../SignUp';
import AllQuiz from '../AllQuiz';
import CreateQuiz from '../CreateQuiz';
import AddQuestion from '../AddQuestion';
import QuizMap from '../QuizMap';


const router = createBrowserRouter([
    {
        path:'/Signup',
       element: <SignUp />
    },
    {
        path: '/',
        element: <SignIn />
    },
    {
        path: '/AllQuiz',
        element: <AllQuiz />
    },
    {
        path: '/CreateQuiz',
        element: <CreateQuiz /> 
    },
    {
        path: '/AddQuestion',
        element: <AddQuestion /> 
    },
    {
        path: '/QuizMap',
        element: <QuizMap /> 
    }
    
]);
export default router;
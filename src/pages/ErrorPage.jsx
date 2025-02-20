import { Link } from 'react-router-dom';
import errorPage from '../assets/ee.jpg';

const ErrorPage = () => {
    return (
        <div>
            <h1 className='text-[#16A34A]'>Error !!!!!</h1>
            <img src={errorPage} alt="" />
            <Link to='/' className='bg-[#16A34A]'>Back to Home</Link>
        </div>
    );
};

export default ErrorPage;
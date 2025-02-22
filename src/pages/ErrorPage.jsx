import { Link } from 'react-router-dom';
import errorPage from '../assets/ee.jpg';

const ErrorPage = () => {
    return (
        <div className='flex items-center flex-col mt-40'>
            {/* <h1 className='text-[#16A34A]'>Error !!!!!</h1> */}
            <img className='w-1/2 lg:w-1/3' src={errorPage} alt="" />
            <Link to='/' className='mt-20 btn bg-[#16A34A]'>Back to Home</Link>
        </div>
    );
};

export default ErrorPage;
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Login = () => {
    const { user, googleSignIn } = useAuth();
    const axiosPublic = useAxiosPublic();
    // console.log(user);
    const navigate = useNavigate();
    if(user){
        return;
    }
    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                console.log(result.user);
                const userInfo = {
                    name: result.user.displayName,
                    email: result.user.email
                }
                axiosPublic.post('/users', userInfo)
                .then(res => {
                    if (res.data.insertedId) {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'User created successfully.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        navigate('/home');
                        // navigate('/dashboard');
                    }
                })
                navigate('/home');
            })
            .catch(error =>
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.message,
                })
            )
        // .then(result =>{
        //     // console.log(result.user);
        //     const userInfo = {
        //         email: result.user?.email,
        //         name: result.user?.displayName,
        //         url: result.user?.photoURL,
        //         role: "member"
        //     }
        //     axiosPublic.post('/users', userInfo)
        //     .then(res =>{
        //         // console.log(res.data);
        //         // Swal.fire('Login successful')
        //         navigate(from, { replace: true });
        //     })
        // })
    }
    return (
        <div
            className="hero min-h-screen top-0 absolute"
            style={{
                backgroundImage: "url(https://i.ibb.co.com/tTZzDgQq/login-bg.jpg)",
            }}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md space-y-4">
                    <h1 className="text-[#16A34A] text-4xl font-bold">Task Management System</h1>
                    <p className="mb-5">
                        Welcome to TMS. Login to continue your journey. It will help your to be more organized and Fast. Giving a collaborative environment, ease in team work is our promise.
                    </p>
                    <button onClick={handleGoogleSignIn} className="btn p-4 bg-white text-black border-[#e5e5e5]">
                        <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                        Login with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
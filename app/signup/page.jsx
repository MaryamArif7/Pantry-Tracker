'use client';
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useRouter } from 'next/navigation';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router=useRouter();

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem('user', true);
      setEmail('');
      setPassword('');
      router.push('/sign-in')
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-onSign">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96 transition-transform transform hover:scale-105">
        <h1 className="text-white text-2xl mb-5 text-center">Sign Up</h1>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500 transition-colors focus:bg-gray-600"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500 transition-colors focus:bg-gray-600"
        />
        <button 
          onClick={handleSignUp}
          className="w-full p-3 bg-purple-600 rounded text-white hover:bg-purple-900 transition-colors duration-200 transform hover:scale-105"
        >
          Sign Up
        </button>
        <p className="text-gray-400 text-center mt-4">
          Already have an account? 
          <a href="/sign-in" className="text-purple-400 hover:underline"> Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

'use client';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    if (typeof window !== 'undefined') {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem('user', true);
      setEmail('');
      setPassword('');
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-violet-600 to-white">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96 transition-transform transform hover:scale-105">
        <h1 className="text-white text-2xl mb-5 text-center">Sign In</h1>
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
          onClick={handleSignIn}
          className="w-full p-3 bg-purple-600 rounded text-white hover:bg-purple-900 transition-colors duration-200 transform hover:scale-105"
        >
          Sign In
        </button>
        <p className="text-gray-400 text-center mt-4">
          Don't have an account? 
          <a href="/signup" className="text-purple-400 hover:underline"> Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;

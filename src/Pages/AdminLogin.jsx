import React from 'react';

export default function AdminLogin() {
    const handleSubmit = (event) => {
        event.preventDefault();

        alert('Form submitted');
    };

    return (
        <div className="max-w-5xl mx-auto flex items-center justify-center h-screen">
            <div className="card px-8 py-6 rounded-lg bg-base-200 w-72">
                <h1 className="text-center font-bold text-3xl text-white">Login Admin</h1>
                <form className="my-6" onSubmit={handleSubmit}>
                    <input className="p-2 my-2 rounded w-full focus:outline-blue-600" placeholder="Email" type="email" required />
                    <input className="p-2 my-2 rounded w-full focus:outline-blue-600" placeholder="Password" type="password" required />
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold p-2 mt-3 rounded w-full" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

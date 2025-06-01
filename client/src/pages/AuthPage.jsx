import { SignOutButton } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { validateUser } from '../apiFunctions';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const navigate = useNavigate();
    const { mutate } = useMutation({
        mutationFn: () => validateUser(),
        onSuccess: (data) => {
            data.found ? navigate('/home') : navigate('/form');
        },
        onError: (error) => {

        },
    });

    // ✅ Trigger validateUser() once on mount
    useEffect(() => {
        mutate();
    }, [mutate]);

    return (
        <div>
            <h1>...Loading</h1>
            <div className="mb-8">
                <SignOutButton redirectUrl="/" />
            </div>
        </div>
    );
};

export default AuthPage;

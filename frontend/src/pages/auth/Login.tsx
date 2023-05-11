import * as React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import Layout from '../../components/layouts/Layout';

interface ILoginProps {
}

export default function Login (props: ILoginProps) {
    return (
        <Layout>
        <LoginForm />
        </Layout>
    );
}

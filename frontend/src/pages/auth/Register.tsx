import RegisterForm from '../../components/auth/RegisterForm';
import AuthLayout from '../../components/layouts/AuthLayout';

interface IRegisterProps {
}

export default function Register (props: IRegisterProps) {
    return (
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    );
}

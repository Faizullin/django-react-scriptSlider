import RegisterForm from '../../components/form/auth/RegisterForm';
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

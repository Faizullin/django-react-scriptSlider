import * as React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import EditProfileForm from '../../components/form/profile/EditProfileForm';
import EditPasswordForm from '../../components/form/profile/EditPasswordForm';

interface IProfileEditProps {
}

export default function ProfileEdit (props: IProfileEditProps) {
    return (
        <DashboardLayout>
            <EditProfileForm />
            <EditPasswordForm />
        </DashboardLayout>
    );
}

import { UpdateUser } from '../../../../types/userProfile';
import { useAuthStore } from '../../../../auth/authStore';
import { apiConfig } from '../../../../api/apiContext';

interface PFPProps {
  visible: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ChangePFP({ visible, onClose }: PFPProps) {
  const API_BASE_URL = apiConfig;

  const onSubmit = async (data: UpdateUser) => {
    onClose(false);
    const response = await fetch(`${API_BASE_URL}/user/actions/edit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };
  const currentUser = useAuthStore();

  return (<></>);
}

// src/utils/toast.ts
import { useNotifications } from 'react-native-notificated';

const { notify } = useNotifications();

export const showSuccessToast = (message: string) => {
  notify('success', {
    params: {
      title: message
    }
  });
};

export const showErrorToast = (message: string) => {
  notify('error', {
    params: {
      title: message
    },
    config: {
      duration: 2500
    }
  });
};

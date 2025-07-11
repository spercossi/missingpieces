import toast from 'react-hot-toast';

const toastConfig = {
  duration: 4000,
  position: 'top-center',
  style: {
    borderRadius: '16px',
    fontSize: '15px',
    fontWeight: '600',
    padding: '16px 24px',
    maxWidth: '500px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
};

// ALERT OK
export const showSuccess = (message, position = 'top-center') => {
  return toast.success(message, {
    ...toastConfig,
    position,
    style: {
      ...toastConfig.style,
      background: 'linear-gradient(135deg, #D5E2D4 0%, #C8D6C7 100%)',
      color: '#1E1E1E',
      border: '1px solid #D5E2D4',
    },
    icon: '✅',
    iconTheme: {
      primary: '#1E1E1E',
      secondary: '#D5E2D4',
    },
  });
};

// ALERT ERRORE
export const showError = (message, position = 'top-center') => {
  return toast.error(message, {
    ...toastConfig,
    position,
    style: {
      ...toastConfig.style,
      background: 'linear-gradient(135deg, #F8D1D1 0%, #E9B5B5 100%)',
      color: '#1E1E1E',
      border: '1px solid #F0ADAD',
    },
    icon: '🚫',
    iconTheme: {
      primary: '#1E1E1E',
      secondary: '#F8D1D1',
    },
  });
};

// ALERT INFO 
export const showInfo = (message, position = 'top-center') => {
  return toast(message, {
    ...toastConfig,
    position,
    style: {
      ...toastConfig.style,
      background: 'linear-gradient(135deg, #D5E7FF 0%, #BDD8FF 100%)',
      color: '#1E1E1E',
      border: '1px solid #BDD8FF',
    },
    icon: 'ℹ️',
    iconTheme: {
      primary: '#1E1E1E',
      secondary: '#D5E7FF',
    },
  });
};

// ALERT WARNING
export const showWarning = (message, position = 'top-center') => {
  return toast(message, {
    ...toastConfig,
    position,
    style: {
      ...toastConfig.style,
      background: 'linear-gradient(135deg, #FFF1C1 0%, #FFE891 100%)',
      color: '#1E1E1E',
      border: '1px solid #FFE891',
    },
    icon: '⚠️',
    iconTheme: {
      primary: '#1E1E1E',
      secondary: '#FFF1C1',
    },
  });
};

// ALERT PERSONALIZZATO OK
export const showBrandSuccess = (message, position = 'top-center') => {
  return toast.success(message, {
    ...toastConfig,
    position,
    style: {
      ...toastConfig.style,
      background: 'linear-gradient(135deg, #F8D9C6 0%, #F0C7B2 100%)',
      color: '#1E1E1E',
      border: '1px solid #F0C7B2',
      boxShadow: '0 25px 50px -12px rgba(196, 165, 116, 0.25)',
    },
    icon: '👔',
    iconTheme: {
      primary: '#1E1E1E',
      secondary: '#F8D9C6',
    },
  });
};

// ALERT PERSONALIZZATO INFO
export const showBrandInfo = (message, position = 'top-center') => {
  return toast(message, {
    ...toastConfig,
    position,
    style: {
      ...toastConfig.style,
      background: 'linear-gradient(135deg, #F3E7E4 0%, #EAD4D1 100%)',
      color: '#1E1E1E',
      border: '1px solid #EAD4D1',
      boxShadow: '0 25px 50px -12px rgba(210, 125, 125, 0.25)',
    },
    icon: '',
    iconTheme: {
      primary: '#1E1E1E',
      secondary: '#F3E7E4',
    },
  });
};

// ALERT PERSONALIZZATO CON CONFERMA
export const showConfirm = (message, onConfirm, onCancel, position = 'top-center') => {
  const toastId = toast(
    (t) => (
      <div className="flex flex-col gap-4">
        {/* Icona ? */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#D4C6F0] text-[#1E1E1E] rounded-full flex items-center justify-center text-sm font-bold shadow-md">
            ?
          </div>
          <p className="text-[#1E1E1E] font-semibold text-base">{message}</p>
        </div>

        {/* Pulsanti */}
        <div className="flex gap-3 ml-11">
          {/* Conferma */}
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm && onConfirm();
            }}
            className="px-6 py-2 bg-gradient-to-r from-[#D27D7D] to-[#B05858] text-[#FFFFFF] rounded-xl text-sm font-semibold hover:from-[#B05858] hover:to-[#9E4747] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Conferma
          </button>

          {/* Annulla */}
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onCancel && onCancel();
            }}
            className="px-6 py-2 bg-gradient-to-r from-[#F3E7E4] to-[#FAFAFA] text-[#1E1E1E] rounded-xl text-sm font-semibold hover:from-[#E8DAD8] hover:to-[#F3F3F3] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Annulla
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position,
      style: {
        background: 'linear-gradient(145deg, #FFFFFF 0%, #FAFAFA 100%)',
        border: '1px solid #D4C6F0',
        borderRadius: '20px',
        padding: '24px',
        boxShadow:
          '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(20px)',
        maxWidth: '450px',
      },
    }
  );

  return toastId;
};


// ALERT CARICAMENTO
export const showLoading = (message = 'Caricamento...', position = 'top-center') => {
  return toast.loading(message, {
    position,
    style: {
      background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
      color: '#1E1E1E',
      border: '1px solid rgba(156, 163, 175, 0.3)',
      borderRadius: '16px',
      padding: '16px 24px',
      fontWeight: '600',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    iconTheme: {
      primary: '#C4A574',
      secondary: '#F3F4F6',
    },
  });
};

// Dismiss loading
export const dismissLoading = (toastId) => {
  toast.dismiss(toastId);
};




import { createContext, useContext, useState } from 'react';

import { useFrappeGetCall } from 'frappe-react-sdk';

const SettingContext = createContext(null);

export const SettingProvider = ({ children }) => {

    const [settings, setSettings] = useState(null);

    const { mutate } = useFrappeGetCall('headless_e_commerce.api.get_website_settings', undefined, undefined, {
        isOnline: () => getToken(),
        onSuccess: (data) => {
            setSettings(data.message)
            console.log(data.message)
        }
    })

    return <SettingContext.Provider value={{
        settings,
        mutate,
    }}>
        {children}
    </SettingContext.Provider>
}

export const useSetting = () => useContext(SettingContext);
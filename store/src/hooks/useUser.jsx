import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, removeToken, setToken } from '../utils/helper';
import { useNavigate } from 'react-router-dom';
import { useFrappeGetCall } from 'frappe-react-sdk';

const userContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();



    const { mutate } = useFrappeGetCall('headless_e_commerce.api.get_profile', {}, 'user-profile', {
        isOnline: () => getToken(),
        onSuccess: (data) => {
            setUser(data.message)
        }
    })


    const login = async (usr, pwd) => {
        try {
            return fetch(`${import.meta.env.VITE_ERP_URL}/api/method/frappeauth_app.authentication.login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    usr: usr,
                    pwd: pwd,
                }),
            }).then((response) => response.json()).then((data) => {
                if (data.message.token) {
                    // handle jwt
                    setToken(data.message.token);
                    // get user
                    mutate()
                }
                return data;
            })

        } catch (error) {
            return error;
        }
    };

    const logout = async () => {
        setUser(null);
        removeToken();
        navigate("/login");
    };

    return <userContext.Provider value={{
        user,
        login,
        logout
    }}>
        {children}
    </userContext.Provider>
}

export const useUser = () => useContext(userContext);
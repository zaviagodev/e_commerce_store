import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, removeToken, setToken } from '../utils/helper';
import { useNavigate } from 'react-router-dom';
import { useFrappeAuth, useFrappeGetCall } from 'frappe-react-sdk';

const userContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const {
        updateCurrentUser,
        logout: frappeLogout,
    } = useFrappeAuth();



    const { mutate } = useFrappeGetCall('headless_e_commerce.api.get_profile', {}, 'user-profile', {
        isOnline: () => getToken(),
        onSuccess: (data) => {
            setUser(data.message)
        }
    })


    const login = async (usr, pwd) => {
        try {
            return fetch(`${import.meta.env.VITE_ERP_URL ?? ""}/api/method/${process.env.USE_TOKEN_AUTH ? "frappeauth_app.authentication.login" : "login"}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    usr: usr,
                    pwd: pwd,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message.token) {
                        // handle jwt
                        setToken(data.message.token);
                    }
                    // get user
                    return mutate().then((data) => {
                        updateCurrentUser();
                        return data;
                    });
                });
        } catch (error) {
            return error;
        }
    };

    const logout = async () => {
        return frappeLogout().then(() => {
            setUser(null);
            removeToken();
            navigate("/login");
        })
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
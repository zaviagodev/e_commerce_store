import { createContext, useContext, useState } from 'react';
import { getToken, removeToken, setToken } from '../utils/helper';
import { useFrappeAuth, useFrappeGetCall } from 'frappe-react-sdk';

const userContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
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
            return fetch(`${import.meta.env.VITE_ERP_URL ?? ""}/api/method/login`, {
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
                    mutate().then((s) => {
                        updateCurrentUser();
                    });
                    return data;

                });
        } catch (error) {
            return error;
        }
    };

    const register = async (email, pwd) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_ERP_URL ?? ""}/api/method/webshop.webshop.api.sign_up`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                full_name: email,
                password: pwd,
                redirect_to: "/",
            }),
        });

        const data = await response.json();
            if (data.message.token) {
                login(email, pwd);
            }
            // mutate().then((s) => {
            //     updateCurrentUser();
            // });
            return data;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error; // Re-throw the error so it can be caught by the calling code if necessary
    }
};


    const logout = async () => {
        return frappeLogout().then(() => {
            setUser(null);
            removeToken();
            frappeLogout()
            window.location.reload();
        })
    };

    return <userContext.Provider value={{
        user,
        login,
        logout,
        register
    }}>
        {children}
    </userContext.Provider>
}

export const useUser = () => useContext(userContext);
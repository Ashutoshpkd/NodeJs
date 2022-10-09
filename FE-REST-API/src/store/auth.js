import React, { useState, useCallback, useEffect } from "react";
let logoutTimer;

const AuthContext = React.createContext({
    token: null,
    userId: null,
    isAuth: false,
    login: (payload) => {},
    logout: (payload) => {},
});

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
  
    const remainingDuration = adjExpirationTime - currentTime;
  
    return remainingDuration;
};

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('access_token');
    const storedExpirationDate = localStorage.getItem('expiryDate');
    const storedUserId = localStorage.getItem('userId');
    const storedRefreshToken = localStorage.getItem('refresh_token');
  
    const remainingTime = calculateRemainingTime(storedExpirationDate);

    return {
        token: storedToken,
        duration: remainingTime,
        userId: storedUserId,
        refreshToken: storedRefreshToken,
    };
};

export const AuthContextProvider = (props) => {
    const tokenData = retrieveStoredToken();

  let initialToken;
  let initialUserId;
  let initialRefreshToken;
  let initialAuth;
  if (tokenData) {
    initialToken = tokenData.token;
    initialUserId =  tokenData.userId;
    initialRefreshToken = tokenData.refreshToken;
    initialAuth = !!tokenData.token;
  }

  const [token, setToken] = useState(initialToken);
  const [userId, setUserId] = useState(initialUserId);
  const [refreshToken, setRefreshToken] = useState(initialRefreshToken);
  const [isAuth, setIsAuth] = useState(initialAuth);

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expiryDate');
        localStorage.removeItem('userId');
        setToken(null);
        setUserId(null);
        setRefreshToken(null);
        setIsAuth(false);

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);

    const refresh = useCallback(() => {

    }, []);

    const login = (payload) => {
        const {
            token: accessToken,
            refreshToken,
            userId,
            expiryDate,
        } = payload;

        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('expiryDate', expiryDate);
        const remainingDuration = calculateRemainingTime(expiryDate);
        setToken(accessToken);
        setUserId(userId);
        setRefreshToken(refreshToken);
        setIsAuth(true);
        logoutTimer = setTimeout(refresh, remainingDuration);
    };

    useEffect(() => {
        if (tokenData) {
            logoutTimer = setTimeout(refresh, tokenData.duration);
        }
    }, [tokenData, refresh])

    const AUTH_STATE = {
        token,
        userId,
        login,
        logout,
        isAuth,
    }

    return (
        <AuthContext.Provider value={AUTH_STATE}>
            {props.children}
        </AuthContext.Provider>
    )
};

export default AuthContext;
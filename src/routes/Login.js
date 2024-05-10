// Home.js
import React, { useEffect } from 'react';
import Login from '../frontend/components/login.js';
const Home = () => {
    useEffect(() => {
        let prevScrollpos = window.pageYOffset;
        window.onscroll = function () {
            let currentScrollPos = window.pageYOffset;
            if (prevScrollpos > currentScrollPos) {
            } else {
            }
            prevScrollpos = currentScrollPos;
        };
    }, []); // empty dependency array to run only once on mount
    return (
        <>
            <Login />
        </>
    );
};

export default Home;




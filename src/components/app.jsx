import React, {useEffect, useState} from "react";
import Sidebar from "./common/sidebar_components/sidebar";
import RightSidebar from "./common/right-sidebar";
import Footer from "./common/footer";
import Header from "./common/header_components/header";
import {Outlet} from "react-router-dom";
import {isLoggedIn} from "../helpers";

const App = (props) => {
	const [userLoggedIn, setUserLoggedIn] = useState(false);

    const initialState = {
        ltr: true,
        divName: "RTL",
    };

    const [side, setSide] = useState(initialState);

    const ChangeRtl = (divName) => {
        if (divName === "RTL") {
            document.body.classList.add("rtl");
            setSide({divName: "LTR"});
        } else {
            document.body.classList.remove("rtl");
            setSide({divName: "RTL"});
        }
    };

	useEffect(() => {
		if (!isLoggedIn()) {
			window.location.href = `${process.env.PUBLIC_URL}/`;
		} else {
			setUserLoggedIn(true);
		}
	}, []);

	return <>
        {userLoggedIn && <>
            <div>
                <div className="page-wrapper">
                    <Header/>
                    <div className="page-body-wrapper">
                        <Sidebar/>
                        <RightSidebar/>
                        <div className="page-body"><Outlet/></div>
                        <Footer/>
                    </div>
                </div>
                <div
                    className="btn-light custom-theme"
                    onClick={() => ChangeRtl(side.divName)}
                >
                    {side.divName}
                </div>
            </div>
        </>
		}
    </>;
};
export default App;

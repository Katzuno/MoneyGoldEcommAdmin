import React, {useEffect, useState} from "react";
import man from "../../../assets/images/dashboard/man.png";
import {getUserInfoFromJwt} from "../../../helpers";
import Cookies from "js-cookie";

const UserPanel = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		if (Cookies.get("jwt_authorization")) {
			const decoded = getUserInfoFromJwt();
			console.log(decoded);
			setUser(decoded);
		}
	}, []);


	return (
		<div>
			<div className="sidebar-user text-center">
				<div>
					<img
						className="img-60 rounded-circle lazyloaded blur-up"
						src={man}
						alt="#"
					/>
				</div>
				<h6 className="mt-3 f-14">{user?.fullName}</h6>
				<p>{user?.roles}</p>
			</div>
		</div>
	);
};

export default UserPanel;

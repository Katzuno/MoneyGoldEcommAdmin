import React, {Fragment, useEffect, useState} from "react";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import { User, Unlock } from "react-feather";
import {  useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import {getApiConfig} from "../../helpers";
import axios from "axios";
import jwt, {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";
import {toast} from "react-toastify";

const LoginTabset = () => {
	const history = useNavigate();
	const [user, setUser] = useState(null);

	const clickActive = (event) => {
		document.querySelector(".nav-link").classList.remove("show");
		event.target.classList.add("show");
	};

	const routeChange = () => {
		history(`${process.env.PUBLIC_URL}/dashboard`);
	};



	const login = (jwt_token) => {
		// Decode JWT token
		const decoded = jwtDecode(jwt_token);

		console.log(decoded);
		// Set user state
		setUser(decoded);

		// Set cookie
		Cookies.set("jwt_authorization", jwt_token);

		window.location.href = '/dashboard';
		// window.location.reload();
	}

	const handleSubmit = async (event) => {
		// Stop the form from submitting and refreshing the page
		event.preventDefault();

		const data = {
			email: event.target.email.value,
			password: event.target.password.value,
		}

		const endpoint = `${getApiConfig().baseUrl}/auth/login-admin`;

		try {
			const response = await axios.post(endpoint, data)
			if (response?.data?.access_token) {
				login(response.data.access_token);
			}
		} catch (e) {
			console.log('intra in catch', e);
			// status 401 - Unauthorized
			// @ts-ignore
			if (e.response?.status == 401 || e.response?.status == 400) {
				toast.error('Datele de logare sunt incorecte. Va rugam sa incercati din nou.');
			}
		}
	}

	useEffect(() => {
		if (Cookies.get('jwt_authorization')) {
			window.location.href = '/dashboard';
		}
	}, []);


	return (
		<div>
			<Fragment>
				<Tabs>
					<TabList className="nav nav-tabs tab-coupon">
						<Tab className="nav-link" onClick={(e) => clickActive(e)}>
							<User />
							Login
						</Tab>
					</TabList>

					<TabPanel>
						<Form className="form-horizontal auth-form" onSubmit={handleSubmit}>
							<FormGroup>
								<Input
									required=""
									name="email"
									type="email"
									className="form-control"
									placeholder="Username"
									id="exampleInputEmail1"
								/>
							</FormGroup>
							<FormGroup>
								<Input
									required=""
									name="password"
									type="password"
									className="form-control"
									placeholder="Password"
								/>
							</FormGroup>
							<div className="form-button">
								<Button
									color="primary"
									type="submit"
								>
									Login
								</Button>
							</div>
						</Form>
					</TabPanel>
					<TabPanel>
						<Form className="form-horizontal auth-form">
							<FormGroup>
								<Input
									required=""
									name="login[username]"
									type="email"
									className="form-control"
									placeholder="Username"
									id="exampleInputEmail12"
								/>
							</FormGroup>
							<FormGroup>
								<Input
									required=""
									name="login[password]"
									type="password"
									className="form-control"
									placeholder="Password"
								/>
							</FormGroup>
							<FormGroup>
								<Input
									required=""
									name="login[password]"
									type="password"
									className="form-control"
									placeholder="Confirm Password"
								/>
							</FormGroup>
							<div className="form-terms">
								<div className="custom-control custom-checkbox me-sm-2">
									<Label className="d-block">
										<Input
											className="checkbox_animated"
											id="chk-ani2"
											type="checkbox"
										/>
										I agree all statements in{" "}
										<span>
											<a href="/#">Terms &amp; Conditions</a>
										</span>
									</Label>
								</div>
							</div>
							<div className="form-button">
								<Button
									color="primary"
									type="submit"
									onClick={() => routeChange()}
								>
									Register
								</Button>
							</div>
							<div className="form-footer">
								<span>Or Sign up with social platforms</span>
								<ul className="social">
									<li>
										<a href="/#">
											<i className="icon-facebook"></i>
										</a>
									</li>
									<li>
										<a href="/#">
											<i className="icon-twitter-alt"></i>
										</a>
									</li>
									<li>
										<a href="/#">
											<i className="icon-instagram"></i>
										</a>
									</li>
									<li>
										<a href="/#">
											<i className="icon-pinterest-alt"></i>
										</a>
									</li>
								</ul>
							</div>
						</Form>
					</TabPanel>
				</Tabs>
			</Fragment>
		</div>
	);
};

export default LoginTabset;

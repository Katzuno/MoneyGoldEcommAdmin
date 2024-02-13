import React, {Fragment, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../common/breadcrumb";
import data from "../../assets/data/listUser";
import Datatable from "../common/datatable";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import axios from "axios";
import {getApiConfig} from "../../helpers";

const List_user = () => {
	const [users, setUsers] = useState([]);

	const getUsers = async () => {
		let response = await axios.get(`${getApiConfig().baseUrl}/users`, {headers: getApiConfig().headers});
		if (response?.data) {
			for (let index in response.data) {
				response.data[index]['activated'] = response.data[index]['activated'] ? 'Da' : 'Nu';
			}
			setUsers(response.data);
		}
	}

	useEffect(() => {
		getUsers();
	}, []);

	return (
		<Fragment>
			<Breadcrumb title="User List" parent="Users" />
			<Container fluid={true}>
				<Card>
					<CardHeader>
						<h5>Lista utilizatori</h5>
					</CardHeader>
					<CardBody>
						{/*<div className="btn-popup pull-right">*/}
						{/*	<Link to="/users/create-user" className="btn btn-secondary">*/}
						{/*		Create User*/}
						{/*	</Link>*/}
						{/*</div>*/}
						{/*<div className="clearfix"></div>*/}
						<div
							id="batchDelete"
							className="category-table user-list order-table coupon-list-delete"
						>
							{users.length > 0 && <Datatable
								multiSelectOption={true}
								myData={users}
								pageSize={10}
								pagination={true}
								objectType={'user'}
								class="-striped -highlight"
							/>
							}
						</div>
					</CardBody>
				</Card>
			</Container>
		</Fragment>
	);
};

export default List_user;

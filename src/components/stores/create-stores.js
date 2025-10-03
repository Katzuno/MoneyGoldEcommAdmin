import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import Breadcrumb from "../common/breadcrumb";
import TabsetStore from "./tabset-stores";
import axios from "axios";
import { getApiConfig } from "../../helpers";

const Create_store = () => {
	const [loadedStore, setLoadedStore] = useState(null);

	const getStore = async (id) => {
		try {
			const response = await axios.get(`${getApiConfig().baseUrl}/store/${id}`, {
				headers: getApiConfig().headers
			});
			if (response?.data) {
				setLoadedStore(response.data);
			}
		} catch (error) {
			console.error('Error loading store:', error);
		}
	};

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const id = params.get('id');
		if (id) {
			getStore(id);
		}
	}, []);

	const isEditing = loadedStore !== null;

	return (
		<Fragment>
			<Breadcrumb
				title={isEditing ? "Editează magazin" : "Creează magazin"}
				parent="Magazine"
			/>
			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>{isEditing ? "Editează magazin" : "Adaugă magazin"}</h5>
							</CardHeader>
							<CardBody>
								<TabsetStore storeId={isEditing ? loadedStore.id : null} />
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Fragment>
	);
};

export default Create_store;
